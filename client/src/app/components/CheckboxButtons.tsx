import { Checkbox, FormControlLabel, FormGroup } from "@mui/material"
import { useState } from "react";

interface Props {
    items: string[];
    checked?: string[];
    onChange: (event: any) => void;
}

const CheckboxButtons = ({ items, checked, onChange }: Props) => {
    const [checkedItems, setCheckItems] = useState(checked || [])

    const handleChecked = (value: string) => {
        const currentIndex = checkedItems.findIndex(item => item === value);
        let newChecked: string[] = [];

        if (currentIndex === - 1) newChecked = [...checkedItems, value];
        else newChecked = checkedItems.filter(item => item !== value);

        setCheckItems(newChecked);
        onChange(newChecked)
    }
    return (
        <FormGroup>
            {items.map(item => (
                <FormControlLabel 
                    control={<Checkbox 
                        checked={checkedItems.indexOf(item) !== -1}
                        onChange={() => handleChecked(item)}
                    />} label={item} key={item} />
            ))}
        </FormGroup>
    )
}

export default CheckboxButtons