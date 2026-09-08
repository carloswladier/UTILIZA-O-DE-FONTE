import { PSU_LABEL_STANDARDS, PsuLabelStandard, getPsuLabelInfo } from './psuLabels';

export interface StickerDetectionResult {
  stickerFound: boolean;
  stickerDescription?: string;
  badgeBg?: string;
  badgeText?: string;
  displayTag?: string;
  deducedVoltage?: string;
  deducedCurrent?: string;
  croppedStickerDataUrl?: string;
  contrastEnhancedDataUrl?: string;
  confidence: number;
  reason?: string;
}

/**
 * Analyzes an image data URL via HTML5 Canvas to:
 * 1. Detect colored stickers (e.g. Claro standard Red or Yellow labels)
 * 2. Deduce Voltage & Current based on label background + text color standard
 * 3. Crop and binarize the sticker region for high-precision OCR
 * 4. Generate a contrast-stretched version of the image to read embossed plastic text
 */
export async function analyzeImageForPsuSticker(imageDataUrl: string): Promise<StickerDetectionResult> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const width = img.naturalWidth || img.width;
        const height = img.naturalHeight || img.height;

        // Create downscaled canvas for pixel color analysis (max 600px dimension for performance)
        const scale = Math.min(1, 600 / Math.max(width, height));
        const scanW = Math.round(width * scale);
        const scanH = Math.round(height * scale);

        const canvas = document.createElement('canvas');
        canvas.width = scanW;
        canvas.height = scanH;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        if (!ctx) {
          resolve({ stickerFound: false, confidence: 0 });
          return;
        }

        ctx.drawImage(img, 0, 0, scanW, scanH);
        const imgData = ctx.getImageData(0, 0, scanW, scanH);
        const data = imgData.data;

        // 1. Identify saturated red and yellow pixels (Claro standard sticker colors)
        let redPixels: { x: number; y: number }[] = [];
        let yellowPixels: { x: number; y: number }[] = [];

        for (let y = 0; y < scanH; y++) {
          for (let x = 0; x < scanW; x++) {
            const idx = (y * scanW + x) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];

            // Saturated Red: R is significantly higher than G and B
            if (r > 120 && r > g * 1.45 && r > b * 1.45) {
              redPixels.push({ x, y });
            }
            // Saturated Yellow: R and G are high, B is low
            else if (r > 130 && g > 120 && b < 90 && Math.abs(r - g) < 60) {
              yellowPixels.push({ x, y });
            }
          }
        }

        let chosenType: 'red' | 'yellow' | null = null;
        let chosenPixels: { x: number; y: number }[] = [];

        // Threshold: A sticker typically occupies at least 150-200 pixels at this scan scale
        if (redPixels.length >= 100) {
          chosenType = 'red';
          chosenPixels = redPixels;
        } else if (yellowPixels.length >= 100) {
          chosenType = 'yellow';
          chosenPixels = yellowPixels;
        }

        let croppedStickerDataUrl: string | undefined;
        let deducedStandard: PsuLabelStandard | undefined;
        let detectionConfidence = 0;
        let detectionReason = '';

        if (chosenType && chosenPixels.length > 0) {
          // Compute bounding box around the densest cluster of sticker pixels
          // Sort coordinates to filter out outlier noise (take 5th to 95th percentiles)
          const xs = chosenPixels.map(p => p.x).sort((a, b) => a - b);
          const ys = chosenPixels.map(p => p.y).sort((a, b) => a - b);

          const minXIndex = Math.floor(xs.length * 0.04);
          const maxXIndex = Math.floor(xs.length * 0.96);
          const minYIndex = Math.floor(ys.length * 0.04);
          const maxYIndex = Math.floor(ys.length * 0.96);

          const rawMinX = xs[minXIndex];
          const rawMaxX = xs[maxXIndex];
          const rawMinY = ys[minYIndex];
          const rawMaxY = ys[maxYIndex];

          // Map back to original image dimensions
          const invScale = 1 / scale;
          const padX = Math.round((rawMaxX - rawMinX) * 0.15 * invScale);
          const padY = Math.round((rawMaxY - rawMinY) * 0.20 * invScale);

          const cropX = Math.max(0, Math.round(rawMinX * invScale) - padX);
          const cropY = Math.max(0, Math.round(rawMinY * invScale) - padY);
          const cropW = Math.min(width - cropX, Math.round((rawMaxX - rawMinX) * invScale) + padX * 2);
          const cropH = Math.min(height - cropY, Math.round((rawMaxY - rawMinY) * invScale) + padY * 2);

          if (cropW > 30 && cropH > 15) {
            // Generate high-resolution cropped sticker canvas
            const cropCanvas = document.createElement('canvas');
            // Scale up to standard width for OCR
            const targetW = 480;
            const targetH = Math.round((cropH * 480) / cropW);
            cropCanvas.width = targetW;
            cropCanvas.height = targetH;
            const cropCtx = cropCanvas.getContext('2d', { willReadFrequently: true });

            if (cropCtx) {
              cropCtx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, targetW, targetH);

              // Analyze text color inside the sticker:
              // Inside the sticker, look for non-background pixels (the text)
              const cropData = cropCtx.getImageData(0, 0, targetW, targetH);
              const cPixels = cropData.data;

              let blueTextCount = 0;
              let yellowTextCount = 0;
              let whiteTextCount = 0;
              let blackTextCount = 0;
              let orangeTextCount = 0;
              let greenTextCount = 0;

              for (let i = 0; i < cPixels.length; i += 4) {
                const r = cPixels[i];
                const g = cPixels[i + 1];
                const b = cPixels[i + 2];

                if (chosenType === 'red') {
                  // If pixel is NOT the red background (i.e. text)
                  const isRedBg = r > 110 && r > g * 1.3 && r > b * 1.3;
                  if (!isRedBg) {
                    // Cyan / Blue text: B is dominant, or higher than R and G
                    if (b > 110 && b > r * 1.1) {
                      blueTextCount++;
                    }
                    // Yellow text: R & G high, B low
                    else if (r > 140 && g > 140 && b < 100) {
                      yellowTextCount++;
                    }
                    // White / very light text
                    else if (r > 160 && g > 160 && b > 160) {
                      whiteTextCount++;
                    }
                    // Black / very dark text
                    else if (r < 60 && g < 60 && b < 60) {
                      blackTextCount++;
                    }
                    // Orange text: R very high, G medium, B low
                    else if (r > 160 && g > 80 && g < 150 && b < 70) {
                      orangeTextCount++;
                    }
                    // Green text: G dominant
                    else if (g > 110 && g > r * 1.2 && g > b * 1.2) {
                      greenTextCount++;
                    }
                  }
                }
              }

              // Apply binarization / high-contrast filter to the cropped sticker for OCR
              // Binarize text vs background
              for (let i = 0; i < cPixels.length; i += 4) {
                const r = cPixels[i];
                const g = cPixels[i + 1];
                const b = cPixels[i + 2];
                // In red sticker, red channel is background, text has lower red
                const isBg = chosenType === 'red' ? (r > 100 && r > g * 1.2 && r > b * 1.2) : (r > 120 && g > 120 && b < 90);
                const mono = isBg ? 255 : 0; // Black text on white background
                cPixels[i] = mono;
                cPixels[i + 1] = mono;
                cPixels[i + 2] = mono;
              }
              cropCtx.putImageData(cropData, 0, 0);
              croppedStickerDataUrl = cropCanvas.toDataURL('image/jpeg', 0.9);

              // Deduce standard from color distribution:
              if (chosenType === 'red') {
                if (blueTextCount > 50 && blueTextCount > yellowTextCount && blueTextCount > whiteTextCount) {
                  deducedStandard = PSU_LABEL_STANDARDS[2]; // 12V 2.5A (Red label, Blue text)
                  detectionConfidence = 0.90;
                  detectionReason = 'Etiqueta vermelha com letras azuis identificada (Padrão Claro NET: 12V 2.5A)';
                } else if (yellowTextCount > 50 && yellowTextCount > blueTextCount && yellowTextCount > whiteTextCount) {
                  deducedStandard = PSU_LABEL_STANDARDS[0]; // 12V 1.5A (Red label, Yellow text)
                  detectionConfidence = 0.85;
                  detectionReason = 'Etiqueta vermelha com letras amarelas identificada (Padrão Claro NET: 12V 1.5A)';
                } else if (whiteTextCount > 80 && whiteTextCount > blueTextCount) {
                  deducedStandard = PSU_LABEL_STANDARDS[1]; // 12V 2.0A (Red label, White text)
                  detectionConfidence = 0.85;
                  detectionReason = 'Etiqueta vermelha com letras brancas identificada (Padrão Claro NET: 12V 2.0A)';
                } else if (orangeTextCount > 50) {
                  deducedStandard = PSU_LABEL_STANDARDS[4]; // 12V 3.5A (Red label, Orange text)
                  detectionConfidence = 0.85;
                  detectionReason = 'Etiqueta vermelha com letras laranjas identificada (Padrão Claro NET: 12V 3.5A)';
                } else if (greenTextCount > 50) {
                  deducedStandard = PSU_LABEL_STANDARDS[5]; // 12V 4.0A (Red label, Green text)
                  detectionConfidence = 0.85;
                  detectionReason = 'Etiqueta vermelha com letras verdes identificada (Padrão Claro NET: 12V 4.0A)';
                } else if (blackTextCount > 80) {
                  deducedStandard = PSU_LABEL_STANDARDS[3]; // 12V 3.0A (Red label, Black text)
                  detectionConfidence = 0.80;
                  detectionReason = 'Etiqueta vermelha com letras pretas identificada (Padrão Claro NET: 12V 3.0A)';
                } else {
                  // Red sticker detected with ambiguous text color
                  detectionConfidence = 0.60;
                  detectionReason = 'Etiqueta adesiva vermelha identificada na carcaça';
                }
              } else if (chosenType === 'yellow') {
                deducedStandard = PSU_LABEL_STANDARDS[6]; // 20V 2.5A (Yellow label, Black text)
                detectionConfidence = 0.85;
                detectionReason = 'Etiqueta amarela com letras pretas identificada (Padrão Claro NET: 20V 2.5A)';
              }
            }
          }
        }

        // 2. Generate a contrast-stretched version of the entire image to help OCR read embossed plastic text
        const contrastCanvas = document.createElement('canvas');
        const cW = Math.min(width, 1200);
        const cH = Math.round((height * cW) / width);
        contrastCanvas.width = cW;
        contrastCanvas.height = cH;
        const cCtx = contrastCanvas.getContext('2d', { willReadFrequently: true });
        let contrastEnhancedDataUrl: string | undefined;

        if (cCtx) {
          cCtx.drawImage(img, 0, 0, cW, cH);
          const fullData = cCtx.getImageData(0, 0, cW, cH);
          const fPix = fullData.data;

          // Simple contrast stretch / high pass for dark plastics
          for (let i = 0; i < fPix.length; i += 4) {
            const gray = 0.299 * fPix[i] + 0.587 * fPix[i + 1] + 0.114 * fPix[i + 2];
            // Stretch contrast for dark/gray regions (typical black embossed plastic)
            let enhanced = gray;
            if (gray < 160) {
              // Expand dark tones
              enhanced = Math.max(0, Math.min(255, (gray - 30) * 1.7));
            }
            fPix[i] = enhanced;
            fPix[i + 1] = enhanced;
            fPix[i + 2] = enhanced;
          }
          cCtx.putImageData(fullData, 0, 0);
          contrastEnhancedDataUrl = contrastCanvas.toDataURL('image/jpeg', 0.85);
        }

        resolve({
          stickerFound: Boolean(chosenType),
          stickerDescription: deducedStandard?.labelDescription || (chosenType ? `Etiqueta ${chosenType.toUpperCase()} identificada` : undefined),
          badgeBg: deducedStandard?.badgeBg,
          badgeText: deducedStandard?.badgeText,
          displayTag: deducedStandard?.displayTag,
          deducedVoltage: deducedStandard?.voltage,
          deducedCurrent: deducedStandard?.current,
          croppedStickerDataUrl,
          contrastEnhancedDataUrl,
          confidence: detectionConfidence,
          reason: detectionReason,
        });
      } catch (err) {
        console.warn('Erro ao analisar adesivo/etiqueta na imagem:', err);
        resolve({ stickerFound: false, confidence: 0 });
      }
    };

    img.onerror = () => {
      resolve({ stickerFound: false, confidence: 0 });
    };

    img.src = imageDataUrl;
  });
}
