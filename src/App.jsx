import React from 'react';
import { calculate } from './calculate.js';

export default class App extends React.Component {
  nextStudentKey = 5;

  state = {
    groups: [
      {
        id: 1, score: '', error: '',
        students: [
          { key: 1, id: '20122', name: 'Nakaji', contribution: '', bonus: '' },
          { key: 2, id: '20133', name: 'Shin', contribution: '', bonus: '' },
        ],
      },
      {
        id: 2, score: '', error: '',
        students: [
          { key: 3, id: '20455', name: 'An', contribution: '', bonus: '' },
          { key: 4, id: '20311', name: 'Bảo', contribution: '', bonus: '' },
        ],
      },
    ],
  };

  addStudent = (groupIndex) => {
    const student = { key: this.nextStudentKey++, id: '', name: '', contribution: '', bonus: '' };
    this.setState((previous) => ({
      groups: previous.groups.map((group, index) => (
        index === groupIndex
          ? { ...group, error: '', students: [...group.students, student] }
          : group
      )),
    }));
  };

  removeStudent = (groupIndex, studentIndex) => {
    this.setState((previous) => ({
      groups: previous.groups.map((group, index) => (
        index === groupIndex
          ? { ...group, error: '', students: group.students.filter((_, i) => i !== studentIndex) }
          : group
      )),
    }));
  };

  handleChange = (groupIndex, studentIndex, field, value) => {
    this.setState((previous) => ({
      groups: previous.groups.map((group, index) => {
        if (index !== groupIndex) return group;

        const number = Number(value);
        let error = '';
        if (field !== 'name' && field !== 'id' && value !== '' && !Number.isFinite(number)) error = 'Vui lòng nhập số hợp lệ.';
        else if (field === 'score' && (number < 0 || number > 20 || !Number.isInteger(number * 2))) {
          error = 'Điểm nhóm từ 0 đến 20, theo bước 0.5.';
        } else if (field === 'contribution') {
          const total = group.students.reduce((sum, student, i) => (
            sum + (i === studentIndex ? number : Number(student.contribution))
          ), 0);
          if (number < 0 || number > 100) error = 'Đóng góp phải từ 0% đến 100%.';
          else if (total > 100 + 1e-9) error = 'Tổng đóng góp của nhóm không được quá 100%.';
        }

        if (error) return { ...group, error };
        if (field === 'score') return { ...group, score: value, error: '' };
        return {
          ...group,
          error: '',
          students: group.students.map((student, i) => (
            i === studentIndex ? { ...student, [field]: value } : student
          )),
        };
      }),
    }));
  };

  render() {
    return (
      <main>
        <h1>Tính điểm BTL</h1>
        <p>Sửa trực tiếp MSSV, họ tên và điểm trong bảng. Thêm hoặc xóa thành viên để thay đổi số người của nhóm.</p>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th scope="col"># nhóm</th>
                <th scope="col">MSSV</th>
                <th scope="col">Họ tên</th>
                <th scope="col">Điểm nhóm</th>
                <th scope="col">Đóng góp</th>
                <th scope="col">Điểm cộng</th>
                <th scope="col">Điểm BTL</th>
                <th scope="col">Thao tác</th>
              </tr>
            </thead>
            {this.state.groups.map((group, groupIndex) => {
              const results = calculate(group);
              const total = group.students.reduce((sum, student) => sum + Number(student.contribution), 0);
              return (
                <tbody key={group.id}>
                  {group.students.map((student, studentIndex) => (
                    <tr key={student.key}>
                      <td>{group.id}</td>
                      <td>
                        <input
                          type="text" className="student-id"
                          aria-label={`MSSV thành viên ${studentIndex + 1} nhóm ${group.id}`}
                          value={student.id} placeholder="MSSV"
                          onChange={(event) => this.handleChange(groupIndex, studentIndex, 'id', event.target.value)}
                        />
                      </td>
                      <td className="name">
                        <input
                          type="text" className="student-name"
                          aria-label={`Họ tên thành viên ${studentIndex + 1} nhóm ${group.id}`}
                          value={student.name} placeholder="Họ tên"
                          onChange={(event) => this.handleChange(groupIndex, studentIndex, 'name', event.target.value)}
                        />
                      </td>
                      {studentIndex === 0 && (
                        <td rowSpan={group.students.length}>
                          <input
                            type="number" min="0" max="20" step="0.5"
                            aria-label={`Điểm nhóm ${group.id}`}
                            value={group.score}
                            onChange={(event) => this.handleChange(groupIndex, null, 'score', event.target.value)}
                          /> /20
                        </td>
                      )}
                      <td>
                        <input
                          type="number" min="0" max="100" step="any"
                          aria-label={`Đóng góp của ${student.name}`}
                          value={student.contribution}
                          onChange={(event) => this.handleChange(groupIndex, studentIndex, 'contribution', event.target.value)}
                        /> %
                      </td>
                      <td>
                        <input
                          type="number" step="any"
                          aria-label={`Điểm cộng của ${student.name}`}
                          value={student.bonus}
                          onChange={(event) => this.handleChange(groupIndex, studentIndex, 'bonus', event.target.value)}
                        />
                      </td>
                      <td className="result" aria-live="polite">
                        {results[studentIndex] === null ? '—' : results[studentIndex].toFixed(2)}
                      </td>
                      <td>
                        <button
                          type="button" className="delete-button"
                          aria-label={`Xóa thành viên ${studentIndex + 1} nhóm ${group.id}`}
                          onClick={() => this.removeStudent(groupIndex, studentIndex)}
                        >Xóa</button>
                      </td>
                    </tr>
                  ))}
                  {group.students.length === 0 && (
                    <tr><td colSpan="8">Nhóm {group.id} chưa có thành viên.</td></tr>
                  )}
                  <tr className="group-note">
                    <td colSpan="8">
                      <div className="group-actions">
                        <span>Nhóm {group.id}: {group.students.length} người · Tổng đóng góp: {Number(total.toFixed(6))}% / 100%</span>
                        <button type="button" onClick={() => this.addStudent(groupIndex)}>+ Thêm thành viên</button>
                      </div>
                      {group.error && <span className="error" role="alert">{group.error}</span>}
                    </td>
                  </tr>
                </tbody>
              );
            })}
          </table>
        </div>

        <p className="note">Điểm nhóm: 0–20, bước 0.5. Tổng đóng góp mỗi nhóm tối đa 100%. Điểm cộng bỏ trống được tính là 0.</p>
        <p className="note">Điểm BTL = điểm nhóm / 2 + điểm điều chỉnh đóng góp + điểm cộng, tối đa 10. Nhập đủ điểm nhóm và đóng góp của các thành viên để tính.</p>
      </main>
    );
  }
}
