const maxScreenWidth = 750;
const minScreenWidth = 400;

function getDynamicStyle(minSize, maxSize) {
  // converting to rem assuming 16px = 1 rem
  const maxWidth = maxScreenWidth / 16;
  const minWidth = minScreenWidth / 16;

  const slope = (maxSize - minSize) / (maxWidth - minWidth);
  const yAxisIntersection = -minWidth * slope + minSize;
  const preferredValue = `${yAxisIntersection}rem + ${slope * 100}vw`;
  return `clamp(${minSize}rem, ${preferredValue}, ${maxSize}rem`;
}

document
  .getElementById("moin")
  .style.setProperty("font-size", getDynamicStyle(5, 8));
document
  .getElementById("moin")
  .style.setProperty("height", getDynamicStyle(5, 10));
