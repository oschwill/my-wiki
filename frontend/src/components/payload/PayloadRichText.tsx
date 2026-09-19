import React from 'react';

interface PayloadRichTextProps {
  content: {
    root: {
      children: unknown[];
    };
  };
}

const PayloadRichText: React.FC<PayloadRichTextProps> = ({ content }) => {
  const renderNode = (node: any): React.ReactNode => {
    if (node.type === 'text') {
      return node.text;
    }

    if (node.type === 'paragraph') {
      return (
        <p key={node.children?.[0]?.text}>
          {node.children?.map((child: any, index: number) => (
            <React.Fragment key={index}>{renderNode(child)}</React.Fragment>
          ))}
        </p>
      );
    }

    if (node.type === 'root') {
      return node.children?.map((child: any, index: number) => (
        <React.Fragment key={index}>{renderNode(child)}</React.Fragment>
      ));
    }

    return null;
  };

  return <div>{renderNode(content.root)}</div>;
};

export default PayloadRichText;
