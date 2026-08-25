import { useState } from "react";
import { Image, ImageProps } from "react-native";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1500835556837-99ac94a94552";
type Props = Omit<ImageProps, 'source'> & {uri?: string | null};
const SafeImage = ({uri, ...rest} : Props) => {
    const [failed, setFailed] = useState(false);
    return (
        <Image 
            source={{uri: !uri || failed ? FALLBACK_IMAGE : uri}}
            onError={() => setFailed(true)}
            {...rest}
        />
    )
}

export default SafeImage;