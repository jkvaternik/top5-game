interface SubmittedByFooterProps {
  submitter: string | null;
}

export default function SubmittedByFooter({ submitter }: SubmittedByFooterProps) {
  if (!submitter) {
    return null;
  }

  return (
    <div className="text-xs text-gray-500 text-center mt-auto italic">
      Submitted by {submitter}
    </div>
  );
}