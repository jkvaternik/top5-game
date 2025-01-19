interface SubmittedByFooterProps {
  submitter: string;
}

export default function SubmittedByFooter({ submitter }: SubmittedByFooterProps) {
  return (
    <div className="text-xs text-gray-500 text-center mt-auto italic">
      Submitted by {submitter}
    </div>
  );
}