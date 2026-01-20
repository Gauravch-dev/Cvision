import { Candidate } from "@/app/dashboard/page";
import CandidateCard from "./CandidateCard";

export default function ResultsList({
  candidates,
  selectedId,
  onSelect,
}: {
  candidates: Candidate[];
  selectedId?: string;
  onSelect: (c: Candidate) => void;
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">Top Candidates</h2>

      {candidates.map((c, i) => (
        <CandidateCard
          key={c.id}
          candidate={c}
          rank={i + 1}
          selected={selectedId === c.id}
          onClick={() => onSelect(c)}
        />
      ))}
    </section>
  );
}
