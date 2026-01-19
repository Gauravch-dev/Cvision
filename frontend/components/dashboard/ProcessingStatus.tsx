import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

export default function ProcessingStatus() {
  const [value, setValue] = useState(10);

  useEffect(() => {
    const interval = setInterval(() => {
      setValue((v) => (v >= 90 ? v : v + 10));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Analyzing resumes and job description…
      </p>
      <Progress value={value} />
    </div>
  );
}
