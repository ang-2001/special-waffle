import { InputContainer } from '../../atoms/InputContainer/InputContainer';
import { Label } from '../../atoms/Label/Label';
import { Input } from '../../atoms/Input/Input';

// Composes the InputContainer/Label/Input atom triplet that was previously
// hand-assembled 5x across LoginForm/RegisterForm.
export const LabeledInput = ({ id, label, type = 'text', containerProps, ...inputProps }) => (
    <InputContainer {...containerProps}>
        <Label htmlFor={id}>{label}</Label>
        <Input id={id} type={type} {...inputProps} />
    </InputContainer>
);

export default LabeledInput;
