import mockBarcode1 from './barcode1.svg';
import mockBarcode2 from './barcode2.svg';
import mockBarcode3 from './barcode3.svg';

export default function mockPaymentCodes() {
  return {
    type: 'code39',
    image1: mockBarcode1,
    image2: mockBarcode2,
    image3: mockBarcode3,
  };
}
