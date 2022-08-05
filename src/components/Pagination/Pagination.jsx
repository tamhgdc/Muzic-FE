import React from "react";
import classnames from "classnames";
import calculatePagination from "./calPagination";
import "./style.scss";

class Pagination extends React.Component {
    onNext = () => {
        if(this.props.currentPage >= Math.ceil(this.props.totalRecords / this.props.pageSize)) return;
        if(this.props.onPageChange) {
            this.props.onPageChange(this.props.currentPage + 1);
        }
    }

    onPrevious = () => {
        if(this.props.currentPage <= 1) return;
        if(this.props.onPageChange) {
            this.props.onPageChange(this.props.currentPage - 1);
        }
    }

    changePage = (page) => {
        if(this.props.onPageChange) {
            this.props.onPageChange(page);
        }
    }
    
    shouldComponentUpdate = (nextProps) => {
        if(this.props.currentPage !== nextProps.currentPage) return true;
        if(this.props.totalRecords !== nextProps.totalRecords) return true;
        return false;
    }

    render() {

        const {
            currentPage,
            totalRecords,
            siblingCount = 1,
            pageSize,
            previousLabel = "Previous",
            nextLabel = "next",
            breakLabel = "...",
            containerClassName,
            pageClassName,
            pageLinkClassName,
            previousClassName,
            previousLinkClassName,
            nextClassName,
            nextLinkClassName,
            breakClassName,
            breakLinkClassName,
            activeClassName,
            activeLinkClassName,
            disabledClassName,
            disabledLinkClassName
        } = this.props;

        const paginationRange = calculatePagination({currentPage,
            totalRecords,
            siblingCount,
            pageSize,
            breakLabel});

        if(currentPage === 0 || paginationRange.length < 2) {
            return null
        }

        const lastPage = paginationRange[paginationRange.length - 1];
        const isFirstPage = currentPage === 1;
        const isLastPage = currentPage === lastPage;

        return (
            totalRecords && 
            <ul className={classnames('pagination full-pagination', 
            { [containerClassName]: containerClassName })}>
                <li
                className={classnames('page-item', 
                { [pageClassName] : pageClassName } , 
                { [previousClassName] : previousClassName }, 
                { [disabledClassName] : isFirstPage && disabledClassName },
                { 'disabled': isFirstPage })}
                onClick={this.onPrevious}>
                    <button className={classnames('page-link', 
                    { [pageLinkClassName] : pageLinkClassName }, 
                    { [previousLinkClassName] : previousLinkClassName },
                    { [disabledLinkClassName] :  isFirstPage && disabledLinkClassName})}>
                        {previousLabel}</button>
                </li>
                {paginationRange.map((pageNumber, index) => {
                    if (pageNumber === breakLabel) {
                        return <li key={index} className={classnames('page-item', 
                                { [pageClassName] : pageClassName } , 
                                { [breakClassName] : breakClassName })}>
                                    <button className={classnames('page-link', 
                                    { [pageLinkClassName] :  pageLinkClassName }, 
                                    { [breakLinkClassName] : breakLinkClassName })}>
                                        {breakLabel}</button>
                                </li>;
                    }
                    
                    const isCurrentPage = pageNumber === currentPage;

                    return (
                        <li
                        key={index}
                        className={classnames('page-item' , 
                        { [pageClassName] : pageClassName } , 
                        { [activeClassName] :  isCurrentPage && activeClassName },
                        {
                            'active': isCurrentPage
                        })}
                        onClick={() => this.changePage(pageNumber)}
                        >
                            <button className={classnames('page-link', 
                            { [pageLinkClassName] : pageLinkClassName },
                            { [activeLinkClassName] : isCurrentPage && activeLinkClassName })}>
                                {pageNumber}</button>
                        </li>
                    );
                })}
                <li
                className={classnames('page-item', 
                { [pageClassName] : pageClassName }, 
                { [nextClassName] : nextClassName } , 
                { [disabledClassName] : isLastPage && disabledClassName },
                { 'disabled': isLastPage},)}
                onClick={this.onNext}
                >
                    <button className={classnames('page-link', 
                    { [nextLinkClassName] : nextLinkClassName },
                    { [disabledLinkClassName] : isLastPage && disabledLinkClassName})}>
                        {nextLabel}</button>
                </li>
          </ul>
        )
    }
}

export default Pagination;