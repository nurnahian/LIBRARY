import User from "../models/User.js";
import FineSetting from "../models/FineSetting.js";

const getLocalIsoDate = (value = new Date()) => {
  const d = new Date(value);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()) - padStart(2, "0")}`;
};

const getStartOfDay = (value) => new Date(new Date(value).setHours(0, 0, 0, 0));

const getDiffInDays = (targetDateString) =>
  Math.round(
    (getStartOfDay(targetDateString) - getStartOfDay(new Date())) / 86400000,
  );

const getOverdueUnits = (overdueDays, interval) => {
  if (overdueDays <= 0) return 0;
  const divisor = { week: 7, month: 30, year: 365 }[interval] || 1;
  return Math.ceil(overdueDays / divisor);
};

const calculateFine = (issue, fineRate = 10, fineInterval = "day") => {
  if (!issue || issue.fineCleared || issue.returnedOn) return 0;
  const overdueDays = Math.max(0, -getDiffInDays(issue.dueDate));
  return (
    getOverdueUnits(overdueDays, fineInterval) * fineRate +
    (Number(issue.manualFine) || 0)
  );
};

// step:1 issue book

export async function issueManualBooks(req, res) {
  try {
    const { studentDetails, books } = req.body;
    if (!Array.isArray(books) || books.length === 0) {
      return res.student(400).json({
        message: "No book were entered",
      });
    }

    const student = await User.findOne({ rollNo: studentDetails.rollNumber });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }
    const todayIso = getLocalIsoDate();

    const validBooks = books.filter((b) => b.title && b.bookCode && b.dueDate);
    if (validBooks.length === 0) {
      return res.status(400).json({
        message:
          "Please add at least one valid manual book entry with book code and due date",
      });
    }

    // const createdIssues = await Promise.all(
    //   validBooks.map((book) =>
    //     Issue.create({
    //       source: "manual",
    //       bookCode: book.bookCode.trim(),
    //       title: book.title.trim(),
    //       userEmail: student.email,
    //       userName: student.name,
    //       IssueOn: todayIso,
    //       dueDate: book.dueDate,
    //       returnedOn: null,
    //       fineRate: Number(book.fineRate ?? req.body.fineRate ?? 10),
    //       fineInterval: book.fineInterval ?? req.body.fineInterval ?? "day",
    //       manualFine:0,
    //       fineCleared:false,
    //       clearedFineAmount:0,

    //     }),
    //   ),
    // );
  } catch (error) {}
}
