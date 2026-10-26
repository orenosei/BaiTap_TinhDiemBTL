export function calculate(group) {
  const students = group.students;
  if (students.length === 0) return [];
  if (group.score === '' || students.some((student) => student.contribution === '')) {
    return students.map(() => null);
  }

  const average = 100 / students.length;
  const plusCount = students.filter((student) => Number(student.contribution) > average).length;
  const minusCount = students.filter((student) => Number(student.contribution) < average).length;
  const totalZ = students.reduce((sum, student) => {
    const contribution = Number(student.contribution);
    return sum + (contribution < average ? Math.abs(contribution - average) * 10 / average : 0);
  }, 0);

  return students.map((student) => {
    const contribution = Number(student.contribution);
    let adjustment = 0;
    if (contribution > average && plusCount > 0) adjustment = totalZ / plusCount;
    if (contribution < average && minusCount > 0) adjustment = -totalZ / minusCount;

    return Math.min(10, Number(group.score) / 2 + adjustment + Number(student.bonus));
  });
}
