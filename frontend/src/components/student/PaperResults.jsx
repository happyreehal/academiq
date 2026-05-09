import PaperCard from "./PaperCard";

export default function PaperResults({ papers, getViewUrl, getDownloadUrl, searched }) {
  return (
    <div className="results-card">
      
      {/* Header */}
      <div className="results-header">
        <h2 className="results-title">Results</h2>
        <span className="results-count">
          {papers.length} PAPER{papers.length !== 1 ? "S" : ""} FOUND
        </span>
      </div>

      {/* Initial State — search nahi hua abhi tak */}
      {!searched ? (
        <div className="no-results">
          <div className="no-results-icon">🔍</div>
          <div className="no-results-text">
            Select filters and search to find papers
          </div>
        </div>

      /* Empty State — search hua but kuch nahi mila */
      ) : papers.length === 0 ? (
        <div className="no-results">
          <div className="no-results-icon">📭</div>
          <div className="no-results-text">
            No papers found for selected filters
          </div>
        </div>

      ) : (
        /* Papers List */
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {papers.map((paper) => (
            <PaperCard 
              key={paper._id || paper.file_url}
              paper={paper}
              viewUrl={getViewUrl(paper.file_url)}
              downloadUrl={getDownloadUrl(paper.file_url)}
            />
          ))}
        </div>
      )}
    </div>
  );
}