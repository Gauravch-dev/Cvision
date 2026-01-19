export default function ResumeView({ data }: { data: any }) {
  return (
    <div>
      {Object.entries(data).map(([section, lines]) => (
        <div
          key={section}
          style={{
            marginBottom: "24px",
            padding: "16px",
            border: "1px solid #ddd",
            borderRadius: "8px",
          }}
        >
          <h2 style={{ textTransform: "uppercase" }}>
            {section}
          </h2>

          <ul>
            {(lines as string[]).map((text, idx) => (
              <li key={idx} style={{ marginBottom: "6px" }}>
                {text}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
