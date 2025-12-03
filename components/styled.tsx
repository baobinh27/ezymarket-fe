import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Platform } from 'react-native';
import styled from 'styled-components/native';

type ITextProps = {
    bold?: boolean,
    semiBold?: boolean,
    size?: number,
    color?: string,
}

/**
 * Text custom, sử dụng font Inter, mặc định: font-weight: 400, color: black
 * 
 * ---
 * **Props**
 * @prop {boolean} bold - Đặt font-weight: 700
 * @prop {boolean} semiBold - Đặt font-weight: 600
 * @prop {string} color - Màu cho text
 */
export const IText = styled.Text<ITextProps>`
    font-family: ${(props: any) => (props.bold ? "Inter_700Bold" : props.semiBold ? "Inter_600SemiBold" : "Inter_400Regular")};
    font-size: ${(props: any) => (props.size ? props.size + 'px' : '14px')};
    color: ${(props: any) => (props.color ? props.color : '#000000B4')}
`

type ItemCardProps = {
    primary?: boolean,
    children?: React.ReactNode,
    isInGroup?: boolean, 
    isFirst?: boolean,
    isLast?: boolean
}

// CSS gradient for web
const WebItemCard = styled.View<ItemCardProps>`
  ${(props) => !props.isFirst && !props.isLast && props.isInGroup ? "border-radius: 0; border-bottom-width: 1px; border-bottom-color: white;" : ""}
  ${(props) => props.isFirst ? "border-radius: 12px 12px 0 0; border-bottom-width: 1px; border-bottom-color: white;" : ""}
  ${(props) => props.isLast ? "border-radius: 0 0 12px 12px;" : ""}
  ${(props) => !props.isInGroup ? "border-radius: 12px;" : ""}
  padding: 10px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  ${({ primary }) =>
    primary
      ? `background-image: linear-gradient(135deg, #46982D, #82CD47);`
      : `background-color: #eee;`}
`;

// LinearGradient for mobile
const MobileItemCard = styled(LinearGradient as any).attrs<ItemCardProps>(
  (props) => ({
    colors: props.primary
      ? ["#46982D", "#82CD47"]
      : ["#eeeeee", "#eeeeee"],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  })
)<ItemCardProps>`
  ${(props) => !props.isFirst && !props.isLast && props.isInGroup ? "border-radius: 0; border-bottom-width: 1px; border-bottom-color: white;" : ""}
  ${(props) => props.isFirst ? "border-radius: 12px 12px 0 0; border-bottom-width: 1px; border-bottom-color: white;" : ""}
  ${(props) => props.isLast ? "border-radius: 0 0 12px 12px;" : ""}
  ${(props) => !props.isInGroup ? "border-radius: 12px;" : ""}
  padding: 10px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  shadow-color: #000;
  shadow-opacity: 0.05;
  shadow-radius: 4px;
  elevation: 1;
`;

/**
 * Component dạng thẻ nằm ngang.
 * 
 * ---
 * **Props**
 * - {boolean} - **[primary]** - Sử dụng theme primary (nền gradient xanh)
 * - {React.ReactElement} - **children** - Danh sách các phần tử `ItemCard` nằm trong nhóm.
 * - {boolean} - **[isFirst]** - (Chỉ sử dụng trong `CardGroup`).
 * - {boolean} - **[isLast]** - (Chỉ sử dụng trong `CardGroup`).
 * - {boolean} - **[isInGroup]** - (Chỉ sử dụng trong `CardGroup`).
 * 
 * ---
 * **Ví dụ sử dụng**
 * ```tsx
 * <ItemCard primary>Gói cơ bản</ItemCard>
 * ```
 */
export const ItemCard: React.FC<ItemCardProps> = ({ primary, children, isFirst, isLast, isInGroup }) => {
  return Platform.OS === "web" ? (
    <WebItemCard primary={primary} isFirst={isFirst} isLast={isLast} isInGroup={isInGroup}>{children}</WebItemCard>
  ) : (
    <MobileItemCard primary={primary} isFirst={isFirst} isLast={isLast} isInGroup={isInGroup}>{children}</MobileItemCard>
  );
};

type CardGroupProps = {
  // children?: React.ReactElement<typeof ItemCard | boolean>[] | React.ReactElement<typeof ItemCard>;
  children?: React.ReactNode;
  style?: object;
};

const GroupContainer = styled.View`
  border-radius: 12px;
  overflow: hidden;
  background-color: transparent;
`;

/**
 * Một component giúp **gom nhóm nhiều `ItemCard`** lại với nhau thành một khối liền mạch (như một “card lớn”).
 * 
 * **Props**
 * - {React.ReactElement<typeof ItemCard>[]} - **children** - Danh sách các phần tử `ItemCard` nằm trong nhóm.
 * - {object} - **[style]** - (Tuỳ chọn) Custom style áp dụng cho container bao ngoài.
 *
 * ---
 * **Ví dụ sử dụng**
 * ```tsx
 * <CardGroup style={{ marginTop: 20 }}>
 *   <ItemCard primary>Gói cơ bản</ItemCard>
 *   <ItemCard>Gói tiêu chuẩn</ItemCard>
 *   <ItemCard>Gói cao cấp</ItemCard>
 * </CardGroup>
 * ```
 *
 * Kết quả:
 * - `ItemCard` đầu tiên được bo góc trên.
 * - `ItemCard` cuối cùng được bo góc dưới.
 * - Các phần tử ở giữa được ngăn cách bởi một border.
 */
export const CardGroup: React.FC<CardGroupProps> = ({ children, style }) => {
  const total = React.Children.count(children);

  return (
    <GroupContainer style={style}>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return null;

        const isFirst = index === 0;
        const isLast = index === total - 1;

        // inject props vào ItemCard
        return React.cloneElement(child as React.ReactElement<ItemCardProps>, { isFirst, isLast, isInGroup: true });
      })}
    </GroupContainer>
  );
};

export const ItemImage = styled.Image`
  width: 36px;
  height: 36px;
  padding: 3px;
  background-color: white;
  border-radius: 5px;
  margin-right: 12px;
`;