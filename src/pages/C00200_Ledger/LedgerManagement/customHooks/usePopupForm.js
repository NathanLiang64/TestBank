import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Box from '@material-ui/core/Box';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  TextareaField,
  TextInputField,
  DropdownField,
} from 'components/Fields';
import { FEIBButton } from 'components/elements';
import { useDispatch } from 'react-redux';
import { setModalVisible } from 'stores/reducers/ModalReducer';
import { customPopup } from 'utilities/MessageModal';

/**
 * 使用方法
 * const { showPopupForm } = usePopupForm();
 * showPopupForm((data) => {console.log(data)})
 */

// 簡單型彈窗hook設定 (單一輸入欄位)
/**
 * title 彈窗名稱
 * limitedText 輸入欄位字數限制
 */
const setSampleConfig = ({ title = '', limitedText = 20 }) => {
  const dispatch = useDispatch();
  const {
    control, handleSubmit, reset, unregister,
  } = useForm({
    defaultValues: { data: '' },
    resolver: yupResolver(
      yup.object().shape({
        data: yup.string().max(limitedText).required('必填'),
      }),
    ),
    mode: 'onChange',
  });

  useEffect(() => {
    reset((formValues) => ({
      ...formValues,
    }));
  }, []);

  const showPopupForm = (callBack = () => {}) => {
    const onSubmitClick = ({ data }) => {
      callBack(data);
      unregister('data');
      dispatch(setModalVisible(false));
    };
    customPopup(
      title,
      <Box>
        <TextareaField
          control={control}
          name="data"
          rowsMin={3}
          rowsMax={6}
          limit={limitedText}
        />
        <Box mt={1}>
          <FEIBButton onClick={handleSubmit(onSubmitClick)}>確認</FEIBButton>
        </Box>
      </Box>,
      false,
    );
  };

  return { showPopupForm };
};

// 複雜型彈窗hook設定 (包含下拉欄位及輸入欄位)
/**
 * title 彈窗名稱
 * labelName 欄位名稱(只有第一欄會顯示)
 * options 下拉欄位選項
 * limitedText 輸入欄位字數限制
 */
const setComplexConfig = ({
  title = '',
  limitedText = 20,
  options = [],
  labelName = '',
}) => {
  const dispatch = useDispatch();
  const { control, handleSubmit, reset } = useForm({
    defaultValues: { dropData: '', textData: '' },
    resolver: yupResolver(
      yup.object().shape({
        dropData: yup.string().required('必填'),
        textData: yup.string().max(limitedText).required('必填'),
      }),
    ),
    mode: 'onChange',
  });

  useEffect(() => {
    reset((formValues) => ({
      ...formValues,
    }));
  }, []);

  const showPopupForm = (callBack = () => {}) => {
    const onSubmitClick = (data) => {
      callBack(data);
      dispatch(setModalVisible(false));
    };
    customPopup(
      title,
      <Box>
        <DropdownField
          name="dropData"
          control={control}
          options={options}
          labelName={labelName}
        />
        <TextInputField
          labelName=""
          type="text"
          name="textData"
          control={control}
          inputProps={{ maxLength: limitedText }}
        />
        <Box mt={1}>
          <FEIBButton onClick={handleSubmit(onSubmitClick)}>確認</FEIBButton>
        </Box>
      </Box>,
      false,
    );
  };

  return { showPopupForm };
};

/**
 * type 1 -> 帶有輸入欄位的 popup
 * type 2 -> 帶有下拉欄位及輸入欄位的 popup
 * config 參考 setSampleConfig / setComplexConfig 參數
 */
export default (type = 1, config = {}) => {
  const typeConfig = {
    1: () => setSampleConfig(config),
    2: () => setComplexConfig(config),
  };
  return typeConfig[type]();
};
