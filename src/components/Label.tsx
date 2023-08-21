import styles from "../style/datePicker.module.css";

interface Props extends React.HTMLProps<HTMLInputElement> {
    label: string;
}

const Label = ({ label }: Props) => {

    return (
        <div>
          {label && (
            <div className={styles.label}>
              <label>{label}</label>
            </div>
          )}
        </div>
    );
}
export default Label;