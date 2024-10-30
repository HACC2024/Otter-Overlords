import { useState } from "react";
import { Resource, State, Tag } from "./App";
import { Dispatch } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Masonry from 'react-masonry-css';
import { Badge } from "./ui/badge";
import { FORMATS, getFormatColor } from "@/utils/convert";
import { BookmarkPlus, BookmarkCheck } from "lucide-react";
import ls from 'local-storage';
import '../styles/iconStyles.css';


interface DatasetsViewProps {
    state: State;
    dispatch: Dispatch<{ type: string; payload: unknown }>;
}

interface DatasetProps {
    state: string;
    title: string;
    notes: string;
    resources: Resource[];
    tags: Tag[];
    isFavorite: boolean;
}

const datasetArr = ({ sortBy, datasets, searchQuery, showTags, showFormats }: {sortBy: string, datasets: DatasetProps[], searchQuery: string, showTags: boolean, showFormats: boolean}) => {
    const bookmarks = localStorage.getItem('hod-bookmarks');
    return datasets
        .filter(dataset => dataset.state === 'active')
        .filter(dataset => {
            return (
                dataset.title.toLowerCase().slice(0, searchQuery.length) === searchQuery.toLowerCase()
                || dataset.title.toLowerCase().includes(searchQuery.toLowerCase())
                || dataset.notes.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }) 
        .sort((a, b) => {
            switch (sortBy) {
                case 'name-asc':
                    return a.title.localeCompare(b.title);
                case 'name-desc':
                    return b.title.localeCompare(a.title);
                case 'last-modified':
                    return 0;
                case 'popularity':
                    return 0;
                default:
                    return 0;
            }
        })
        .map((dataset, index) => {
            const favoriteCheck = bookmarks ? JSON.parse(bookmarks).includes(dataset.title) : false;
            return (
                <Dataset
                key={index}
                title={dataset.title}
                notes={dataset.notes}
                tags={showTags ? dataset.tags : []}
                state={dataset.state}
                resources={showFormats ? dataset.resources : []}
                isFavorite={favoriteCheck}
                />
            );
        });
};

const Dataset: React.FC<DatasetProps> = ({ title, notes, tags, resources, isFavorite }) => {

    const [isBookmarked, setIsBookmarked] = useState(isFavorite);

    const handleBookmarkClick = () => {
        setIsBookmarked(!isBookmarked);
        const bookmarks = window.localStorage.getItem('hod-bookmarks');
        if (bookmarks) {
            const bookmarksArray = JSON.parse(bookmarks);
            if (isBookmarked) {
                const newBookmarks = bookmarksArray.filter((bookmark: string) => bookmark !== title);
                window.localStorage.setItem('hod-bookmarks', JSON.stringify(newBookmarks));
            } else {
                window.localStorage.setItem('hod-bookmarks', JSON.stringify([...bookmarksArray, title]));
            }
        } else {
            window.localStorage.setItem('hod-bookmarks', JSON.stringify([title]));
        }
    };

    return (
        <Card className="w-full mb-4 shadow-md transition-transform transform hover:-translate-y-1 hover:shadow-lg hover:bg-gray-50">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                {
                    notes.length > 0 && 
                        <CardDescription className="break-words whitespace-normal">
                            <div dangerouslySetInnerHTML={{ __html: notes }} />
                        </CardDescription>
                }
            </CardHeader>
            {
                resources.length > 0 &&
                    <CardContent className="flex flex-wrap">
                        {resources
                            .filter(resource => resource.state === 'active')
                            .filter(resource => FORMATS.includes(resource.format)) // !!! Change later ???
                            .map((resource, index) => (
                                <Badge key={index}
                                    className="m-0.5" 
                                    style={{ backgroundColor: getFormatColor(resource.format) }}
                                >
                                    {resource.format}
                                </Badge>
                        ))}
                    </CardContent>
            }
            {
                tags.length > 0 &&
                    <CardContent className="flex flex-wrap">
                        {tags.map((tag, index) => (
                            <Badge className="m-0.5" key={index}>{tag.display_name}</Badge>
                        ))}
                    </CardContent>
            }
            <hr className="border-t border-gray-300 my-2" />
            <CardFooter className="flex items-center justify-between">
                <div className="flex items-center justify-between icon-container" onClick={handleBookmarkClick}>
                    {isBookmarked ? <BookmarkCheck className="icon" /> : <BookmarkPlus className="icon" />}
                </div>
            </CardFooter>
        </Card>
    );
};

const DatasetsView: React.FC<DatasetsViewProps> = ({ state, dispatch }) => {

    const BREAK_POINT_COLUMNS_OBJ = {
        default: 3,
        1100: 2,
        700: 1,
    };

    return (
        <Masonry
            breakpointCols={BREAK_POINT_COLUMNS_OBJ}
            className="flex -ml-4 w-auto mt-2"
            columnClassName="pl-4 bg-clip-padding"
        >
            {datasetArr(state)}
        </Masonry>
    );
};

export default DatasetsView;
