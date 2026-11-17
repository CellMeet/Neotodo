"""The right-border Doing card comes out in one cut.

The peek used to travel in from outside its border: a 0.38s transform slide
(shortened to 0.08s by the near-instant choreography pass). Opening it is not a
movement the reader asked for, so the closed card simply becomes the open card
on the same frame: no transform, no opacity ramp.

The pull and its drop glide are a different gesture and keep their compositor
transitions, so this test pins both sides of that line.
"""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def rule(css: str, selector: str) -> str:
    return css.split(selector, 1)[1].split("}", 1)[0]


def main() -> int:
    css = (ROOT / "web" / "style.css").read_text(encoding="utf-8")

    # The base card and its open state both cut, with no travel in between.
    base = rule(css, "\n.doing-peek {\n")
    assert "transition: none;" in base, "the closed peek must not animate"
    assert "transform 0.38s" not in base, "the slide is gone"

    opened = rule(css, "\n.doing-peek.open {\n")
    assert "transition: none;" in opened, "the open peek must not animate"
    assert "transform 0.38s" not in opened, "the slide is gone"

    # The near-instant panel pass must not bring the slide back.
    choreography = rule(css, ".doing-peek,\n.doing-peek.open {")
    assert "transition: none;" in choreography

    # Dropping a pulled card still glides home on the compositor.
    snapping = rule(css, ".doing-peek.doing-snapping,")
    assert "translate 0.3s" in snapping, "the drop glide is not the open slide"

    print("the Doing card opens and closes without a slide")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
