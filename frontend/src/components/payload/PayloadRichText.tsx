import parse from 'html-react-parser';

interface PayloadRichTextProps {
  html: string;
}

const PayloadRichText = ({ html }: PayloadRichTextProps) => {
  if (!html) {
    return null;
  }

  return <div>{parse(html)}</div>;
};

export default PayloadRichText;
