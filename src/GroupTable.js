import React from 'react';
import axios from 'axios';
import styled, { keyframes } from 'styled-components'
import { device } from './constants';
import LoadingSpinner from './LoadingSpinner';

const DEFAULT_PAGE_SIZE = 24;

const poof = keyframes`
    0% {
        opacity: 0;
        transform: translateY(-5px);
    }
    100% {
        opacity: 1;
        transform: translateY(0px);
    }
`;

const TableWrapper = styled.div`
    width: 80%;
    margin: 0 auto;
    display: grid;
    column-gap: 1rem;
    row-gap: 2rem;
    margin-top: 5rem;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    grid-auto-rows: minmax(min-content, max-content);
    place-items: center;
    direction: rtl;

    @media ${device.tablet} {
        width: 70%;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    }
`;

const PageWrapper = styled.div`
    display: block;
`;

const GroupCard = styled.a`
    opacity: 0;
    animation: ${poof} .5s forwards;
    animation-delay: ${props => (props.idx % DEFAULT_PAGE_SIZE) * 0.07}s;
    transition: all .3s ease;
    border: 1px solid #eee;
    box-shadow: 0 13px 27px -5px hsla(240, 30.1%, 28%, 0.25), 0 8px 16px -8px hsla(0, 0%, 0%, 0.3), 0 -6px 16px -6px hsla(0, 0%, 0%, 0.03);;
    border-radius: 0.6em;
    width: inherit;
    color: inherit;
    text-decoration: inherit;
    height: 10rem;
    padding: 1rem;
    margin: 1rem;
    transition: all ease 200ms;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    &:hover {
        transform: scale(1.03);
        box-shadow: 0 13px 40px -5px hsla(240, 30.1%, 28%, 0.12), 0 8px 32px -8px hsla(0, 0%, 0%, 0.14), 0 -6px 32px -6px hsla(0, 0%, 0%, 0.02);
        }
    }

`;

const GroupCardArea = styled.p`
    direction: rtl;
`;

const GroupCardName = styled.h3`
    direction: rtl;
`;

const GroupCardCategory = styled.p`
    direction: rtl;
`;

export default class GroupList extends React.Component {

    constructor(props) {
        super(props);
        this.scrollRef = React.createRef();
        this.handleScrollEvent = this.handleScrollEvent.bind(this);
        this.state = {
            groups: [],
            loadingState: false,
            endOfList: false,
            offset: 0
        };
    }

  
  handleScrollEvent() {
    console.log("log_event");
    if (document.documentElement.scrollTop + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 20) {
        this.loadMoreItems();
    }
  }
  componentDidMount() {
    this.loadMoreItems();
    const { scrollRef } = this;
    document.addEventListener("scroll", this.handleScrollEvent)
  }

  componentWillUnmount() {
    document.removeEventListener("scroll", this.handleScrollEvent);
  }
  

  loadMoreItems() {
    if(this.state.loadingState || this.state.endOfList){
            return;
    }
    this.setState({ loadingState: true });
    setTimeout(() => {   
        axios.post(`https://ec2-18-183-57-250.ap-northeast-1.compute.amazonaws.com/api/groups`, {offset: this.state.offset, page_size: DEFAULT_PAGE_SIZE})
            .then(res => {
                const newGroups = JSON.parse(res.data);
                const oldGroups = this.state.groups;
                let endOfList = false;
                console.log(oldGroups);
                const groups = [...new Map([...oldGroups, ...newGroups].map((item) => [item["group_link"], item])).values()];
                if (newGroups.length < DEFAULT_PAGE_SIZE) {
                    endOfList = true;
                }
                const offset = this.state.offset + newGroups.length;
                this.setState({ groups, loadingState: false, endOfList, offset });
            })
    }, 1000);
  }

  render() {
    const { groups, loadingState } = this.state;
    return (
    <PageWrapper>
      <TableWrapper ref={this.scrollRef}>
        {
        
            (
                groups.map((group, idx) =>
                    <GroupCard idx={idx} key={group.group_link}>
                        <GroupCardCategory>
                            {group.category}
                        </GroupCardCategory>
                        <GroupCardName>
                            {group.group_name}
                        </GroupCardName>
                        <GroupCardArea>
                            {group.area}
                        </GroupCardArea>
                    </GroupCard>
                )  
            )
        }       
    
      </TableWrapper>
        {
            loadingState && 
                <LoadingSpinner /> 
        }
      </PageWrapper>
    )
  }
}