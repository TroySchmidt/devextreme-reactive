import {
  GROUP_KEY_SEPARATOR,
} from '../grouping-state/constants';
import {
  GRID_GROUP_TYPE,
  GRID_GROUP_CHECK,
  GRID_GROUP_LEVEL_KEY,
} from './constants';

export const groupRowChecker = row => row[GRID_GROUP_CHECK];

export const groupRowLevelKeyGetter = row => row[GRID_GROUP_LEVEL_KEY];

const defaultColumnIdentity = value => ({
  key: String(value),
  value,
});

export const groupedRows = (
  rows,
  grouping,
  getCellValue,
  getColumnIdentity,
  keyPrefix = '',
) => {
  if (!grouping.length) return rows;

  const { columnName } = grouping[0];
  const groupIdentity = (getColumnIdentity && getColumnIdentity(columnName))
    || defaultColumnIdentity;
  const groups = rows
    .reduce((acc, row) => {
      const { key, value = key } = groupIdentity(getCellValue(row, columnName), row);
      const sameKeyItems = acc.get(key);

      if (!sameKeyItems) {
        acc.set(key, [value, key, [row]]);
      } else {
        sameKeyItems[2].push(row);
      }
      return acc;
    }, new Map());

  const groupedBy = grouping[0].columnName;
  const nestedGrouping = grouping.slice(1);
  return [...groups.values()]
    .reduce((acc, [value, key, items]) => {
      const compoundKey = `${keyPrefix}${key}`;
      acc.push({
        [GRID_GROUP_CHECK]: true,
        [GRID_GROUP_LEVEL_KEY]: `${GRID_GROUP_TYPE}_${groupedBy}`,
        groupedBy,
        compoundKey,
        key,
        value,
      });
      acc.push(...groupedRows(
        items,
        nestedGrouping,
        getCellValue,
        getColumnIdentity,
        `${compoundKey}${GROUP_KEY_SEPARATOR}`,
      ));
      return acc;
    }, []);
};

export const expandedGroupRows = (rows, grouping, expandedGroups) => {
  if (!grouping.length) return rows;

  const groupingColumnNames = grouping.map(columnGrouping => columnGrouping.columnName);
  let currentGroupExpanded = true;
  let currentGroupLevel = 0;
  return rows.reduce((acc, row) => {
    if (!row[GRID_GROUP_CHECK]) {
      if (currentGroupExpanded) acc.push(row);
      return acc;
    }

    const groupLevel = groupingColumnNames.indexOf(row.groupedBy);
    if (groupLevel > currentGroupLevel && !currentGroupExpanded) {
      return acc;
    }

    currentGroupExpanded = expandedGroups.has(row.compoundKey);
    currentGroupLevel = groupLevel;

    acc.push(row);
    return acc;
  }, []);
};
