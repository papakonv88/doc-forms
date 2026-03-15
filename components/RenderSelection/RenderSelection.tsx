import {Box, Checkbox, Divider, FormControlLabel, Radio, RadioGroup} from "@mui/material";
import TextWithPlaceholders from "../TextWithPlaceholder/TextWithPlaceholders";
import {useMemo} from "react";

function RenderSelection ({story, index, selectedStoryTexts, handlePlaceholderChange, handleStoryTextSelection, placeholderValues, isMulti}) {
    const placeholderMap = useMemo(() => {
        if (!Array.isArray(story.placeholders)) return story.placeholders || {};
        const map: Record<string, { values: string[]; allowFreeText?: boolean; multiple?: boolean }> = {};
        story.placeholders.forEach((p: { title?: string; values?: string[]; allowFreeText?: boolean; multiple?: boolean }) => {
            const key = (p?.title || "").replace(/\s+/g, "");
            map[key] = { values: p?.values || [], allowFreeText: p?.allowFreeText === true, multiple: p?.multiple === true };
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

    // Multi-select mode: use Checkboxes (only the checkbox toggles on click, not the container)
    return (
        <>
            {story.texts.map((text, textIndex) => {
                const isChecked = selectedArray.includes(text);
                return (
                    <Box key={textIndex}>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: 2,
                                columnGap: 2,
                            }}
                        >
                            <Checkbox
                                checked={isChecked}
                                onChange={(e) => handleStoryTextSelection(e, index, textIndex, true)}
                            />
                            <Box sx={{ flex: 1, pt: 0.5 }}>
                                {story.placeholders ? (
                                    <TextWithPlaceholders
                                        text={text}
                                        textIndex={textIndex}
                                        placeholders={placeholderMap}
                                        values={placeholderValues}
                                        onChange={handlePlaceholderChange}
                                    />
                                ) : (
                                    text
                                )}
                            </Box>
                        </Box>
                        {(textIndex !== story.texts.length - 1) && <Divider sx={{ padding: '10px 0' }}/>}
                    </Box>
                );
            })}
        </>
    );
}

export default RenderSelection;
