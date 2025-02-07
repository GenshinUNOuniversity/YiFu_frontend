import { FacultyFatherVO } from '@/api/user';

// 根据学院Id设定学院索引
export const findFacultyIndex = (facultyId: number | undefined, bigFacultyList: FacultyFatherVO[]) => {
  let index = [0, 0];
  if (facultyId !== undefined) {
    bigFacultyList.forEach((faculty, i) => {
      faculty.facultyList.forEach((item, j) => {
        if (item.facultyId === facultyId) {
          index = [i, j];
        }
      });
    });
  }
  return index;
};
