import React from "react";
import styled from "styled-components";
import { observer } from "mobx-react";


const TableWrapper = styled.div`
    display: flex;
    flex-direction: column;
    padding-top: 1rem;
    padding-right: .5rem;
    padding-left: .5rem;
    margin-right: .5rem;
    margin-left: .5rem;
    row-gap: .2rem;
`;

const TableRow = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    background-color ${({ palette, alternate }) => alternate ? palette.pending.alternateBackground : palette.pending.background};
    color: ${({ palette }) =>  palette.pending.text};
    padding-top: .75rem;
    padding-bottom: .75rem;
    direction: rtl;
    ${({ isOpen }) => isOpen && 'pointer-events:none;'}
`;

const TableHeader = styled(TableRow)`
    font-weight: bold;
    font-size: 1em;
    background-color: inherit;
`;

const TableCell = styled.div`
    display: flex;
    direction: rtl;
    padding: 0.5rem;
    gap: 1rem;
    justify-content: space-evenly;
`;


const PendingGroupsTableMobile = ({ groups, setOpen, setRowInfo, colorPalette, isOpen }) => (

    <TableWrapper>
    <TableHeader alternate={false} palette={colorPalette}>
                <TableCell>
                    קטגוריה
                </TableCell>
                <TableCell>
                    שם קבוצה
                </TableCell>
                <TableCell>
                    אזור
                </TableCell>
            </TableHeader>
            {
                groups.length === 0 ? 
                (
                <div>
                    <TableRow alternate={false} palette={colorPalette} >
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
                            <TableCell>
                                {row.area}
                            </TableCell>
                        </TableRow>
                    )

                    )
                )
            }
    </TableWrapper>
)

export default observer(PendingGroupsTableMobile);