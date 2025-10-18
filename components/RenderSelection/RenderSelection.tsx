import {Divider, FormControlLabel, Radio, RadioGroup} from "@mui/material";
import TextWithPlaceholders from "../TextWithPlaceholder/TextWithPlaceholders";
import {useMemo} from "react";

function RenderSelection ({story, index, selectedStoryTexts, handlePlaceholderChange, handleStoryTextSelection, placeholderValues}) {
    const placeholderMap = useMemo(() => {
        if (!Array.isArray(story.placeholders)) return story.placeholders || {};
        const map: Record<string, string[]> = {};
        story.placeholders.forEach((p: { title?: string; values?: string[] }) => {
            const key = (p?.title || "").replace(/\s+/g, "");
            map[key] = p?.values || [];
        });
        return map;
    }, [story.placeholders]);
    return (
        <RadioGroup
            value={story.texts.indexOf(selectedStoryTexts[index])}
            onChange={(e) => handleStoryTextSelection(e, index)}
        >
            {story.texts.map((text, textIndex) => (
                <>
                    <FormControlLabel
                        key={textIndex}
                        value={textIndex}
                        control={<Radio/>}
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

export default RenderSelection;
