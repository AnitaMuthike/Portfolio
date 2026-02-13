#!/usr/bin/env python3
import html
import re
import textwrap
import zipfile
from pathlib import Path
import sys


def usage() -> None:
    print(
        "Usage: python3 src/utils/docx_to_pdf.py <input.docx> <output.pdf>",
        file=sys.stderr,
    )


def pdf_escape(value: str) -> str:
    return value.replace("\\", r"\\").replace("(", r"\(").replace(")", r"\)")


def docx_to_lines(docx_path: Path) -> list[str]:
    with zipfile.ZipFile(docx_path, "r") as archive:
        xml = archive.read("word/document.xml").decode("utf-8", errors="ignore")

    xml = re.sub(r"<w:tab[^>]*/>", "\t", xml)
    xml = re.sub(r"</w:p>", "\n", xml)
    xml = re.sub(r"<[^>]+>", "", xml)
    text = html.unescape(xml)

    lines: list[str] = []
    for raw_line in text.splitlines():
        normalized = re.sub(r"\s+", " ", raw_line).strip()
        if normalized:
            lines.extend(textwrap.wrap(normalized, width=92) or [""])

    return lines or ["Anita Muthike CV"]


def write_pdf(lines: list[str], output_path: Path) -> None:
    page_width = 595
    page_height = 842
    margin_left = 50
    margin_top = 790
    line_height = 14
    lines_per_page = 50
    chunks = [lines[i : i + lines_per_page] for i in range(0, len(lines), lines_per_page)]
    if not chunks:
        chunks = [[]]

    objects: list[bytes] = []

    def add_object(content: bytes) -> int:
        objects.append(content)
        return len(objects)

    font_id = add_object(b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>")

    page_ids: list[int] = []
    content_ids: list[int] = []
    for chunk in chunks:
        stream_lines = ["BT", "/F1 11 Tf", f"{margin_left} {margin_top} Td"]
        for index, line in enumerate(chunk):
            escaped = pdf_escape(line)
            if index == 0:
                stream_lines.append(f"({escaped}) Tj")
            else:
                stream_lines.append(f"0 -{line_height} Td ({escaped}) Tj")
        stream_lines.append("ET")
        stream_data = "\n".join(stream_lines).encode("latin-1", errors="replace")

        content_id = add_object(
            b"<< /Length "
            + str(len(stream_data)).encode("ascii")
            + b" >>\nstream\n"
            + stream_data
            + b"\nendstream"
        )
        content_ids.append(content_id)

        page_id = add_object(b"")
        page_ids.append(page_id)

    kids = "[ " + " ".join(f"{page_id} 0 R" for page_id in page_ids) + " ]"
    pages_id = add_object(
        f"<< /Type /Pages /Kids {kids} /Count {len(page_ids)} >>".encode("ascii")
    )

    for idx, page_id in enumerate(page_ids):
        content_id = content_ids[idx]
        page_obj = (
            f"<< /Type /Page /Parent {pages_id} 0 R "
            f"/MediaBox [0 0 {page_width} {page_height}] "
            f"/Resources << /Font << /F1 {font_id} 0 R >> >> "
            f"/Contents {content_id} 0 R >>"
        ).encode("ascii")
        objects[page_id - 1] = page_obj

    catalog_id = add_object(f"<< /Type /Catalog /Pages {pages_id} 0 R >>".encode("ascii"))

    pdf = bytearray(b"%PDF-1.4\n")
    offsets = [0]
    for obj_id, obj in enumerate(objects, start=1):
        offsets.append(len(pdf))
        pdf.extend(f"{obj_id} 0 obj\n".encode("ascii"))
        pdf.extend(obj)
        pdf.extend(b"\nendobj\n")

    xref_position = len(pdf)
    pdf.extend(f"xref\n0 {len(objects) + 1}\n".encode("ascii"))
    pdf.extend(b"0000000000 65535 f \n")
    for offset in offsets[1:]:
        pdf.extend(f"{offset:010d} 00000 n \n".encode("ascii"))

    trailer = (
        f"trailer\n<< /Size {len(objects) + 1} /Root {catalog_id} 0 R >>\n"
        f"startxref\n{xref_position}\n%%EOF\n"
    ).encode("ascii")
    pdf.extend(trailer)

    output_path.write_bytes(pdf)


def main() -> int:
    if len(sys.argv) != 3:
        usage()
        return 1

    docx_path = Path(sys.argv[1]).resolve()
    pdf_path = Path(sys.argv[2]).resolve()

    if not docx_path.exists() or docx_path.suffix.lower() != ".docx":
        print("Input DOCX file was not found.", file=sys.stderr)
        return 1

    lines = docx_to_lines(docx_path)
    write_pdf(lines, pdf_path)
    print(f"Created PDF: {pdf_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
