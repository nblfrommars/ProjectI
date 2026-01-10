import React, { useState } from "react";
import "../../styles/Specification.css";
import bangsize from "../../assets/bangsize.png";
const Specification = () => {
  const [gender, setGender] = useState("nam");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [result, setResult] = useState(null);

  const sizeData = {
    nam: [
      { size: "S", hMin: 155, hMax: 160, wMin: 50, wMax: 56 },
      { size: "M", hMin: 161, hMax: 166, wMin: 57, wMax: 62 },
      { size: "L", hMin: 167, hMax: 172, wMin: 63, wMax: 68 },
      { size: "XL", hMin: 173, hMax: 177, wMin: 69, wMax: 73 },
      { size: "XXL", hMin: 178, hMax: 181, wMin: 74, wMax: 77 },
    ],
    nu: [
      { size: "S", hMin: 151, hMax: 155, wMin: 41, wMax: 46 },
      { size: "M", hMin: 156, hMax: 160, wMin: 47, wMax: 52 },
      { size: "L", hMin: 161, hMax: 163, wMin: 53, wMax: 57 },
      { size: "XL", hMin: 164, hMax: 167, wMin: 58, wMax: 62 },
      { size: "XXL", hMin: 168, hMax: 172, wMin: 63, wMax: 75 },
    ],
  };

  const calculateAdvancedSize = () => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (!h || !w) return;

    const data = sizeData[gender];

    if (
      h < data[0].hMin - 5 ||
      h > data[data.length - 1].hMax + 5 ||
      w < data[0].wMin - 5 ||
      w > data[data.length - 1].wMax + 5
    ) {
      setResult({
        type: "contact",
        message:
          "Thông số của bạn nằm ngoài bảng size chuẩn. Liên hệ với chúng tớ để được tư vấn nhé!",
      });
      return;
    }
    //tinh chenh lech tu van size
    const scores = data.map((item) => {
      const hMid = (item.hMin + item.hMax) / 2;
      const wMid = (item.wMin + item.wMax) / 2;
      const hDiff = Math.abs(h - hMid) / (item.hMax - item.hMin);
      const wDiff = Math.abs(w - wMid) / (item.wMax - item.wMin);
      return { ...item, totalScore: hDiff + wDiff };
    });

    const bestFit = scores.reduce((prev, curr) =>
      prev.totalScore < curr.totalScore ? prev : curr
    );

    let warnings = [];
    if (h < bestFit.hMin) warnings.push("Đồ sẽ hơi dài với bạn");
    else if (h > bestFit.hMax) warnings.push("Đồ sẽ hơi ngắn với bạn");
    if (w < bestFit.wMin) warnings.push("Đồ sẽ hơi rộng ngang đấy");
    else if (w > bestFit.wMax) warnings.push("Đồ sẽ hơi bó nha");

    setResult({
      type: "success",
      size: bestFit.size,
      warnings,
      isPerfect: warnings.length === 0,
    });
  };

  return (
    <div className="spec-container">
      <div className="spec-header">
        <h2>TƯ VẤN CHỌN SIZE</h2>
        <div className="spec-divider"></div>
      </div>

      <div className="size-image-container">
        <img src={bangsize} alt="Size Chart" />
      </div>

      <div className="input-grid">
        <div className="input-group">
          <label>Giới tính</label>
          <div className="gender-toggle">
            <button
              className={`gender-btn ${gender === "nam" ? "active nam" : ""}`}
              onClick={() => setGender("nam")}
            >
              NAM
            </button>
            <button
              className={`gender-btn ${gender === "nu" ? "active nu" : ""}`}
              onClick={() => setGender("nu")}
            >
              NỮ
            </button>
          </div>
        </div>

        <div className="input-group">
          <label>Chiều cao (cm)</label>
          <input
            type="number"
            className="input-field"
            placeholder="170"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Cân nặng (kg)</label>
          <input
            type="number"
            className="input-field"
            placeholder="65"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </div>
      </div>

      <button className="calc-btn" onClick={calculateAdvancedSize}>
        PHÂN TÍCH SIZE
      </button>

      {result &&
        (result.type === "contact" ? (
          <div className="contact-card text-center">
            <p>{result.message}</p>
          </div>
        ) : (
          <div className="result-card">
            <span className="result-label">Size gợi ý của bạn</span>
            <div className="result-size">{result.size}</div>

            {result.isPerfect ? (
              <div className="perfect-badge">Vừa đúng với kích cỡ của bạn</div>
            ) : (
              <div className="warning-container">
                {result.warnings.map((w, i) => (
                  <span key={i} className="warning-tag">
                    ⚠ {w}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
    </div>
  );
};

export default Specification;
