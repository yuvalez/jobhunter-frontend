import React from "react";
import styled, { css } from "styled-components";
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { observer } from "mobx-react";


const TableWrapper = styled.div`
    display: flex;
    flex-direction: column;
    padding-top: 2rem;
    padding-right: 1rem;
    padding-left: 1rem;
    margin-right: 2rem;
    margin-left: 2rem;
    row-gap: .2rem;
`;

const TableRow = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 2fr 1fr 0.5fr;
    background-color ${({ palette, alternate }) => alternate ? palette.pending.alternateBackground : palette.pending.background};
    color: ${({ palette }) =>  palette.pending.text};
    padding-top: .75rem;
    padding-bottom: .75rem;
    direction: rtl;
    ${({ isOpen }) => isOpen && 'pointer-events:none;'}
`;

const TableHeader = styled(TableRow)`
    font-weight: bold;
    font-size: 1.6em;
    background-color: inherit;
`;

const TableCell = styled.div`
    display: flex;
    direction: rtl;
    padding: 0.5rem;
    gap: 1rem;
    justify-content: space-evenly;
`;

const TableCellLink = styled.a`
    display: flex;
    direction: rtl;
    padding: 0.5rem;
    gap: 1rem;
    justify-content: space-evenly;
    text-overflow: clip;
    overflow:hidden;
    white-space:nowrap;
    color: ${({ palette }) => palette.pending.link};
`;

const IconCSS = css`
height: 1.5rem;
width: 1.5rem;
&:hover {
    cursor: pointer;
}
${({ isOpen }) => isOpen && 'pointer-events:none;'}
`;

const ApproveIcon = styled(FaCheckCircle)`
${IconCSS}
`;
const DisapproveIcon = styled(FaTimesCircle)`
${IconCSS}
`;


const PendingGroupsTableDesktop = ({ groups, setOpen, setRowInfo, colorPalette, clickOnApprove, clickOnDisapprove, isOpen }) => (

    <TableWrapper>
    <TableHeader alternate={false} palette={colorPalette}>
                <TableCell>
                    קטגוריה
                </TableCell>
                <TableCell>
                    שם קבוצה
                </TableCell>
                <TableCell>
                    קישור
                </TableCell>
                <TableCell>
                    אזור
                </TableCell>
                <TableCell>
                    אשר/דחה
                </TableCell>
            </TableHeader>
            {
                groups.length === 0 ? 
                (
                <div>
                    <TableRow alternate={false} palette={colorPalette}>
                        אין רשומות
                    </TableRow>
                </div>
                ) :
                (
                    groups.map((row, idx) => (
                        <TableRow alternate={idx % 2 === 1} palette={colorPalette} isOpen={isOpen} onClick={e => {
                            e.stopPropagation();
                            setOpen(true);
                            setRowInfo(row);
                        }}>
                            <TableCell>
                                {row.category}
                            </TableCell>
                            <TableCell>
                                {row.group_name}
                            </TableCell>
                            <TableCellLink palette={colorPalette} href={row.group_link} target="_blank" onClick={e => e.stopPropagation()}>
                                {row.group_link}
                            </TableCellLink>
                            <TableCell>
                                {row.area}
                            </TableCell>
                            <TableCell>
                                <ApproveIcon isOpen={isOpen} color="green" onClick={async (e) => {
                                    e.stopPropagation();
                                    await clickOnApprove(e, row);
                                }}/>
                                <DisapproveIcon isOpen={isOpen} color="red" onClick={async (e) => {
                                    e.stopPropagation();
                                    await clickOnDisapprove(e, row);
                                }}/>
                            </TableCell>
                        </TableRow>
                    )

                    )
                )
            }
    </TableWrapper>
);

export default observer(PendingGroupsTableDesktop);