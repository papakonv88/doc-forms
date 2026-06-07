import html2canvas from "html2canvas";
import {jsPDF} from "jspdf";

async function waitForImages(element: HTMLElement): Promise<void> {
    const images = Array.from(element.querySelectorAll("img"));
    await Promise.all(
        images.map(
            (img) =>
                new Promise<void>((resolve) => {
                    if (img.complete) {
                        resolve();
                        return;
                    }
                    img.onload = () => resolve();
                    img.onerror = () => resolve();
                })
        )
    );
}

function downloadPdfBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.setTimeout(() => URL.revokeObjectURL(url), 120_000);
}

export async function exportElementToPdf(element: HTMLElement, filename: string): Promise<void> {
    const clone = element.cloneNode(true) as HTMLElement;
    clone.style.position = "fixed";
    clone.style.left = "-10000px";
    clone.style.top = "0";
    clone.style.pointerEvents = "none";
    document.body.appendChild(clone);

    try {
        await waitForImages(clone);

        const canvas = await html2canvas(clone, {
            scale: 2,
            useCORS: true,
            backgroundColor: "#ffffff",
            logging: false,
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 10;
        const contentWidth = pageWidth - margin * 2;

        const imgHeight = (canvas.height * contentWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = margin;

        pdf.addImage(imgData, "PNG", margin, position, contentWidth, imgHeight);
        heightLeft -= pageHeight - margin * 2;

        while (heightLeft > 0) {
            position = margin - (imgHeight - heightLeft);
            pdf.addPage();
            pdf.addImage(imgData, "PNG", margin, position, contentWidth, imgHeight);
            heightLeft -= pageHeight - margin * 2;
        }

        downloadPdfBlob(pdf.output("blob"), filename);
    } finally {
        if (clone.parentNode === document.body) {
            document.body.removeChild(clone);
        }
    }
}
