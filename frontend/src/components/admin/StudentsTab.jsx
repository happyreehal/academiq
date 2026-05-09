// ✅ Fix — component bahar nikalo
const StudentItem = ({ student, actions }) => (
  <div className="list-item">
    <div>
      <div className="list-item-name">{student.name ?? "Unknown"}</div>
      <div className="list-item-info">
        {student.email} {student.college_id && `• ${student.college_id}`}
      </div>
    </div>
    <div style={{ display: "flex", gap: "10px" }}>
      {actions}
    </div>
  </div>
);

export default function StudentsTab({ students, approveStudent, rejectStudent, removeStudent }) {
  const pendingStudents = students.filter(s => s.status === "pending");
  const activeStudents = students.filter(s => s.status === "active");
  const rejectedStudents = students.filter(s => s.status === "rejected");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      
      {/* PENDING */}
      <div className="card">
        <h2 className="card-title">
          ⏳ Pending Requests 
          <span className="badge badge-yellow">{pendingStudents.length}</span>
        </h2>
        {pendingStudents.length === 0 ? (
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", fontWeight: "300" }}>
            No pending requests
          </p>
        ) : (
          pendingStudents.map(s => (
            <StudentItem 
              key={s.email} 
              student={s}
              actions={
                <>
                  <button className="btn-approve" onClick={() => approveStudent(s.email)}>✅ Approve</button>
                  <button className="btn-reject" onClick={() => rejectStudent(s.email)}>❌ Reject</button>
                </>
              }
            />
          ))
        )}
      </div>

      {/* ACTIVE */}
      <div className="card">
        <h2 className="card-title">
          ✅ Active Students 
          <span className="badge badge-green">{activeStudents.length}</span>
        </h2>
        {activeStudents.length === 0 ? (
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", fontWeight: "300" }}>
            No active students
          </p>
        ) : (
          activeStudents.map(s => (
            <StudentItem 
              key={s.email} 
              student={s}
              actions={
                <button className="btn-danger" onClick={() => removeStudent(s.email)}>🗑️ Remove</button>
              }
            />
          ))
        )}
      </div>

      {/* REJECTED */}
      {rejectedStudents.length > 0 && (
        <div className="card">
          <h2 className="card-title">
            ❌ Rejected 
            <span className="badge badge-red">{rejectedStudents.length}</span>
          </h2>
          {rejectedStudents.map(s => (
            <StudentItem 
              key={s.email} 
              student={s}
              actions={
                <>
                  <button className="btn-approve" onClick={() => approveStudent(s.email)}>✅ Approve</button>
                  <button className="btn-danger" onClick={() => removeStudent(s.email)}>🗑️ Remove</button>
                </>
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}