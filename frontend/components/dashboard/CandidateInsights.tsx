import { Card, CardContent } from "@/components/ui/card";
import { Candidate } from "@/app/dashboard/page";

export default function CandidateInsights({
  candidate,
}: {
  candidate: Candidate;
}) {
  const b = candidate.breakdown;
  if (!b) return null;

  return (
    <Card className="border-primary/30">
      <CardContent className="p-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold">{candidate.name}</h3>
          <p className="text-sm text-muted-foreground">
            {b.reasoning}
          </p>
        </div>

        <div>
          <p className="text-sm font-medium mb-2">Matched Skills</p>
          <div className="flex flex-wrap gap-2">
            {b.matchedSkills.map((s) => (
              <span key={s} className="px-3 py-1 rounded-full bg-primary/10">
                {s}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium mb-2 text-destructive">
            Missing Skills
          </p>
          <div className="flex flex-wrap gap-2">
            {b.missingSkills.map((s) => (
              <span
                key={s}
                className="px-3 py-1 rounded-full bg-destructive/10"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
