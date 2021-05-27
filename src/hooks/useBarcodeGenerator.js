import { useBarcode } from 'react-barcodes';

const useBarcodeGenerator = (value) => {
  const { inputRef } = useBarcode({
    value,
    options: {
      height: 64,
    },
  });

  return <svg className="barcode" ref={inputRef} />;
};

export default useBarcodeGenerator;
