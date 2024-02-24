import {
  EllipsisContent,
  FlexCenter,
  SimpleButton,
} from '@erxes/ui/src/styles/main';
import { colors, dimensions } from '@erxes/ui/src/styles';
import styled, { css } from 'styled-components';

import styledTS from 'styled-components-ts';

const ScrollContent = styled.div`
  flex: 1;
  overflow: auto;

  .weighted-score-table-body {
    .with-input:last-child {
      background-color: ${colors.bgLightPurple};
      border-left: 1px solid ${colors.borderPrimary};
    }
  }
`;

const RightItems = styled(FlexCenter)`
  > div {
    margin-right: 10px;
  }
`;

const ConversationItems = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;

const CheckBox = styled.div`
  margin-top: ${dimensions.unitSpacing}px;
  margin-right: ${dimensions.unitSpacing}px;
  position: absolute;
  left: 0px;
`;

const RowContent = styledTS<{ $isChecked?: boolean }>(styled.div)`
  flex: 1;
  display: flex;
  flex-direction: row;
  max-width: 100%;
  transition: all ease 0.3s;
  position: relative;
  padding-left: ${(props) => props.$isChecked && '30px'};

  &:hover {
    padding-left: 30px;

    ${CheckBox} {
      width: 30px;
    }
  }

  ${CheckBox} {
    width: ${(props) => (props.$isChecked ? '30px' : '0')};
    margin: 0;
    overflow: hidden;
    transition: all ease 0.3s;

    > label {
      margin-top: 7px;
    }
  }
`;

const FlexContent = styled.div`
  flex: 1;
  max-width: 100%;
  transition: all ease 0.3s;

  .tags {
    margin-top: 5px;
    line-height: 1;

    > span {
      margin-bottom: 3px;
    }
  }
`;

const MainInfo = styled.div`
  overflow: hidden;

  > span {
    margin-right: ${dimensions.unitSpacing}px;
  }
`;

const Count = styled.div`
  min-width: 18px;
  margin-left: 5px;
  color: ${colors.colorCoreGray};
  background-color: ${colors.bgGray};
  line-height: 18px;
  font-size: 10px;
  font-weight: 600;
  padding: 0 4px;
  border-radius: 9px;
  text-align: center;
`;

const SmallTextOneLine = styled(EllipsisContent)`
  color: ${colors.colorCoreGray};
  font-size: 12px;
`;

const MessageContent = styled(FlexCenter)`
  margin-top: 7px;
  line-height: 18px;
`;

const RowItem = styledTS<{
  $isActive?: boolean;
  $isRead?: boolean;
}>(styled.li)`
  padding: ${dimensions.coreSpacing}px;
  display: flex;
  position: relative;
  flex-direction: row;
  border-bottom: 1px solid rgba(0,0,0,0.05);
  transition: all ease 0.3s;
  background: ${(props) => (props.$isActive ? 'rgba(242,245,245,0.8)' : null)};

  ${(props) =>
    !props.$isRead &&
    css`
      background: ${colors.bgUnread};
      border-top: 1px solid rgba(0, 0, 0, 0.05);
      border-left: 1px solid ${colors.colorSecondary};
      margin-top: -1px;

      ${MessageContent} {
        font-weight: 700;
      }
    `};
  &:hover {
    background: ${(props) =>
      !props.$isRead || props.$isActive ? '' : colors.bgLight};
    cursor: pointer;
  }
`;

const Idle = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  border: 5px solid transparent;
  border-right-color: ${colors.colorCoreRed};
  border-bottom-color: ${colors.colorCoreRed};
  transition: all ease 0.3s;

  &:before {
    font-family: 'erxes';
    content: '\\ea47';
    font-size: 10px;
    position: absolute;
    color: ${colors.colorWhite};
    top: -4px;
    opacity: 0;
  }

  &:hover {
    border-width: 10px;

    &:before {
      opacity: 1;
    }
  }
`;

const AssigneeImg = styled.img`
  height: ${dimensions.coreSpacing - 2}px;
  width: ${dimensions.coreSpacing - 2}px;
  line-height: ${dimensions.coreSpacing - 2}px;
  border-radius: ${dimensions.unitSpacing}px;
  margin-left: 5px;
`;

const SidebarActions = styled.div`
  #date-popover,
  [id^='headlessui-popover-panel-'] {
    max-width: 470px;
    width: 500px;
  }

  .rdtPicker {
    width: 100%;
  }
`;

const LeftContent = styledTS<{ $isOpen?: boolean }>(styled.div)`
  display: flex;
  position: relative;
  flex-direction: row;
  padding-left: ${(props) => props.$isOpen && '200px'};
  transition: padding 0.3s ease;
  box-shadow: 0 0 5px 0 rgba(0,0,0,.08);

  > section {
    margin: 0;
    box-shadow: none;
  }
`;

const shadowColor = 'rgba(0,0,0,0.15)';

const AdditionalSidebar = styled.aside`
  width: 200px;
  background: ${colors.bgLight};
  flex-shrink: 0;
  box-shadow: inset -40px 0px 40px -40px ${shadowColor};
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;

  ul > li > a {
    padding: 5px 22px;
  }
`;

const SidebarContent = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;

  ${ScrollContent} {
    padding: 10px 0;
  }

  > button {
    text-align: left;
    border-top: 1px solid #eee;
    border-radius: 0;

    i {
      color: ${colors.colorCoreOrange};
    }
  }
`;

const DropdownWrapper = styled.div`
  position: relative;

  > div {
    padding-left: 20px;
    display: inline-block;
    position: relative;
  }
`;

const ToggleButton = styled(SimpleButton)`
  margin-left: -5px;
  margin-right: 10px;
`;

export {
  ConversationItems,
  RightItems,
  RowItem,
  RowContent,
  FlexContent,
  CheckBox,
  MainInfo,
  FlexCenter,
  Count,
  SmallTextOneLine,
  MessageContent,
  AssigneeImg,
  SidebarActions,
  AdditionalSidebar,
  SidebarContent,
  LeftContent,
  DropdownWrapper,
  ToggleButton,
  Idle,
  ScrollContent,
};
