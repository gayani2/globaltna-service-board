/**
 * StatusBadge
 * Renders a coloured pill based on job status.
 */
export default function StatusBadge({ status }) {
  const styles = {
    Open:        "badge-open",
    "In Progress": "badge-progress",
    Closed:      "badge-closed",
  };

  return (
    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${styles[status] || "badge-closed"}`}>
      {status}
    </span>
  );
}
