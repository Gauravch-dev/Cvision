import { Card } from "@/components/ui/card";
import { Candidate } from "@/app/dashboard/page";

export default function CandidateCard({
  candidate,
  rank,
  selected,
  onClick,
}: {
  candidate: Candidate;
  rank: number;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <Card
      onClick={onClick}
      className={`p-6 cursor-pointer transition-all hover:scale-[1.01] ${
        selected
          ? "border-primary ring-1 ring-primary/30"
          : "hover:border-primary/40"
      }`}
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs text-muted-foreground">Rank #{rank}</p>
          <h3 className="text-lg font-semibold">{candidate.name}</h3>
          <p className="text-sm text-muted-foreground">
            {candidate.experience} yrs experience
          </p>
        </div>

        <div className="text-right">
          <p className="text-3xl font-bold text-primary transition-all">
            {candidate.score}%
          </p>
          <p className="text-xs text-muted-foreground">Match</p>
        </div>
      </div>
    </Card>
  );
}
