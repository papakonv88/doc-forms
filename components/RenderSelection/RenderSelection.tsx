import {Checkbox, Divider, FormControlLabel, Radio, RadioGroup} from "@mui/material";
import TextWithPlaceholders from "../TextWithPlaceholder/TextWithPlaceholders";
import {useMemo} from "react";

function RenderSelection ({story, index, selectedStoryTexts, handlePlaceholderChange, handleStoryTextSelection, placeholderValues, isMulti}) {
    const placeholderMap = useMemo(() => {
        if (!Array.isArray(story.placeholders)) return story.placeholders || {};
        const map: Record<string, string[]> = {};
        story.placeholders.forEach((p: { title?: string; values?: string[] }) => {
            const key = (p?.title || "").replace(/\s+/g, "");
            map[key] = p?.values || [];
        });
        return map;
    }, [story.placeholders]);

    const selectedArray = selectedStoryTexts[index] || [];

    if (!isMulti) {
        // Single-select mode: use RadioGroup
        const selectedValue = story.texts.indexOf(selectedArray[0] || "");
        return (
            <RadioGroup
                value={selectedValue === -1 ? "" : selectedValue}
                onChange={(e) => handleStoryTextSelection(e, index, Number(e.target.value), false)}
            >
                {story.texts.map((text, textIndex) => (
                    <>
                        <FormControlLabel
                            key={textIndex}
                            value={textIndex}
                            control={<Radio />}
                            label={
                                story.placeholders ? (
                                    <TextWithPlaceholders
                                        text={text}
                                        textIndex={textIndex}
                                        placeholders={placeholderMap}
                                        values={placeholderValues}
                                        onChange={handlePlaceholderChange}
                                    />
                                ) : (
                                    text
                                )
                            }
                            sx={{
                                padding: 2,
                                alignItems: 'center',
                                columnGap: 2,
                                '.MuiFormControlLabel-label': {
                                    pt: 1
                                }
                            }}
                        />
                        {(textIndex !== story.texts.length - 1) && <Divider sx={{ padding: '10px 0' }}/>}
                    </>
                ))}
            </RadioGroup>
        );
    }

    // Multi-select mode: use Checkboxes
    return (
        <>
            {story.texts.map((text, textIndex) => {
                const isChecked = selectedArray.includes(text);
                return (
                    <>
                        <FormControlLabel
                            key={textIndex}
                            control={
                                <Checkbox
                                    checked={isChecked}
                                    onChange={(e) => handleStoryTextSelection(e, index, textIndex, true)}
                                />
                            }
                            label={
                                story.placeholders ? (
                                    <TextWithPlaceholders
                                        text={text}
                                        textIndex={textIndex}
                                        placeholders={placeholderMap}
                                        values={placeholderValues}
                                        onChange={handlePlaceholderChange}
                                    />
                                ) : (
                                    text
                                )
                            }
                            sx={{
                                padding: 2,
                                alignItems: 'center',
                                columnGap: 2,
                                '.MuiFormControlLabel-label': {
                                    pt: 1
                                }
                            }}
                        />
                        {(textIndex !== story.texts.length - 1) && <Divider sx={{ padding: '10px 0' }}/>}
                    </>
                );
            })}
        </>
    );
}

export default RenderSelection;
