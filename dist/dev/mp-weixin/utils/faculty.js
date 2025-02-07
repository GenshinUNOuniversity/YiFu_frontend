"use strict";
const findFacultyIndex = (facultyId, bigFacultyList) => {
  let index = [0, 0];
  if (facultyId !== void 0) {
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
exports.findFacultyIndex = findFacultyIndex;
