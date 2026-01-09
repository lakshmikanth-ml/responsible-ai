import { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function D3AlignedLineChart({
  data,
  breakEvenMonth,
  showZeroLine = false,
  height = 220,
  color = "#2563eb",
  title
}) {
  const ref = useRef();

  useEffect(() => {
    if (!data?.length) return;

    const container = ref.current;
    const width = container.clientWidth;

    const margin = { top: 24, right: 24, bottom: 36, left: 56 };
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    d3.select(container).selectAll("*").remove();

    const svg = d3
      .select(container)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    /* -----------------------------
     * Scales
     * --------------------------- */
    const x = d3
      .scaleLinear()
      .domain([1, data.length])
      .range([0, innerW]);

    const y = d3
      .scaleLinear()
      .domain(d3.extent(data))
      .nice()
      .range([innerH, 0]);

    /* -----------------------------
     * Axes
     * --------------------------- */
    g.append("g")
      .attr("transform", `translate(0,${innerH})`)
      .call(d3.axisBottom(x).ticks(6));

    g.append("g").call(d3.axisLeft(y).ticks(5));

    /* -----------------------------
     * Zero line (HTML parity)
     * --------------------------- */
    if (showZeroLine && y(0) >= 0 && y(0) <= innerH) {
      g.append("line")
        .attr("x1", 0)
        .attr("x2", innerW)
        .attr("y1", y(0))
        .attr("y2", y(0))
        .attr("stroke", "#f59e0b")
        .attr("stroke-dasharray", "4 4");
    }

    /* -----------------------------
     * Line path
     * --------------------------- */
    const line = d3
      .line()
      .x((_, i) => x(i + 1))
      .y(d => y(d));

    g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", color)
      .attr("stroke-width", 2)
      .attr("d", line);

    /* -----------------------------
     * Break-even marker
     * --------------------------- */
    if (breakEvenMonth) {
      g.append("line")
        .attr("x1", x(breakEvenMonth))
        .attr("x2", x(breakEvenMonth))
        .attr("y1", 0)
        .attr("y2", innerH)
        .attr("stroke", "#10b981")
        .attr("stroke-dasharray", "4 4");

      g.append("text")
        .attr("x", x(breakEvenMonth) + 6)
        .attr("y", 12)
        .attr("fill", "#10b981")
        .attr("font-size", 12)
        .text(`Break-even (mo ${breakEvenMonth})`);
    }

    /* -----------------------------
     * Tooltip
     * --------------------------- */
    const tooltip = d3
      .select(container)
      .append("div")
      .style("position", "absolute")
      .style("pointer-events", "none")
      .style("background", "#fff")
      .style("border", "1px solid #e5e7eb")
      .style("border-radius", "6px")
      .style("padding", "6px 8px")
      .style("font-size", "12px")
      .style("display", "none");

    const hoverLine = g
      .append("line")
      .attr("y1", 0)
      .attr("y2", innerH)
      .attr("stroke", "#9ca3af")
      .attr("stroke-dasharray", "3 3")
      .style("display", "none");

    svg
      .append("rect")
      .attr("transform", `translate(${margin.left},${margin.top})`)
      .attr("width", innerW)
      .attr("height", innerH)
      .attr("fill", "transparent")
      .on("mousemove", (event) => {
        const [mx] = d3.pointer(event);
        const month = Math.round(x.invert(mx));
        const value = data[month - 1];
        if (!value) return;

        hoverLine
          .attr("x1", x(month))
          .attr("x2", x(month))
          .style("display", "block");

        tooltip
          .style("display", "block")
          .style("left", `${event.pageX + 12}px`)
          .style("top", `${event.pageY - 28}px`)
          .html(`<strong>Month ${month}</strong><br/>${value.toFixed(2)}`);
      })
      .on("mouseleave", () => {
        hoverLine.style("display", "none");
        tooltip.style("display", "none");
      });
  }, [data, breakEvenMonth, showZeroLine, height, color]);

  return <div ref={ref} style={{ width: "100%", position: "relative" }} />;
}
