
const rangeArray = (start, end) => {
    const length = end - start + 1;
    return Array.from({ length }, (_, index) => index + start);
}

const calculatePagination = ({currentPage, totalRecords, siblingCount, pageSize, breakLabel}) => {

    const totalPageCount = Math.ceil(totalRecords / pageSize);

    // Pages count is determined as siblingCount + firstPage + lastPage + currentPage + 2*breakLabel
    const totalPageNumbers = siblingCount + 5;

    /*
      If the number of pages is less than the page numbers we want to show in our
      paginationComponent, we return the range [1..totalPageCount]
    */
    if (totalPageNumbers >= totalPageCount) {
      return rangeArray(1, totalPageCount);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(
      currentPage + siblingCount,
      totalPageCount
    );

    /*
      We do not want to show dots if there is only one position left 
      after/before the left/right page count as that would lead to a change if our Pagination
      component size which we do not want
    */
    const shouldShowLeftBreak = leftSiblingIndex > 2;
    const shouldShowRightBreak = rightSiblingIndex < totalPageCount - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPageCount;

    if (!shouldShowLeftBreak && shouldShowRightBreak) {
      let leftItemCount = 3 + 2 * siblingCount;
      let leftRange = rangeArray(1, leftItemCount);

      return [...leftRange, breakLabel, totalPageCount];
    }

    if (shouldShowLeftBreak && !shouldShowRightBreak) {
      let rightItemCount = 3 + 2 * siblingCount;
      let rightRange = rangeArray(
        totalPageCount - rightItemCount + 1,
        totalPageCount
      );
      return [firstPageIndex, breakLabel, ...rightRange];
    }

    if (shouldShowLeftBreak && shouldShowRightBreak) {
      let middleRange = rangeArray(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, breakLabel, ...middleRange, breakLabel, lastPageIndex];
    }
}


export default calculatePagination;