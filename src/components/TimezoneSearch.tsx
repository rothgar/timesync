import { useAtom } from "jotai";
import { searchTimezoneNameAtom } from "~/atoms/search-timezone-name";
import { Search } from "lucide-react";
import { shouldDisabledFeaturesAtom } from "~/atoms/selected-timezones";
import { cn } from "~/utils/cn";
import { useEffect, useRef, useState } from "react";

export default function TimezoneSearch() {
  const [searchTimezoneName, setSearchTimezone] = useAtom(
    searchTimezoneNameAtom
  );
  const [shouldDisabledSearch] = useAtom(shouldDisabledFeaturesAtom);
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const showInput = isExpanded || !!searchTimezoneName;

  useEffect(() => {
    if (!searchTimezoneName) setIsExpanded(false);
  }, [searchTimezoneName]);

  function handleOpen() {
    if (shouldDisabledSearch) return;
    setIsExpanded(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  function handleBlur() {
    if (!searchTimezoneName) setIsExpanded(false);
  }

  return (
    <div
      className={cn(
        "relative h-full transition-[width] duration-200",
        showInput ? "w-[300px]" : "w-10"
      )}
    >
      {showInput ? (
        <>
          <input
            ref={inputRef}
            type="text"
            value={searchTimezoneName}
            name="search"
            disabled={shouldDisabledSearch}
            onChange={(e) => setSearchTimezone(e.target.value)}
            onBlur={handleBlur}
            placeholder="City or Timezone"
            className={cn(
              "p-2 h-full w-full rounded-md text-sm pl-4 focus:outline-none primary_bg primary_border placeholder:text-xs",
              {
                "cursor-not-allowed": shouldDisabledSearch,
              }
            )}
          />
          {!searchTimezoneName && (
            <Search
              strokeWidth={1}
              size={20}
              className="absolute right-4 top-[50%] translate-y-[-50%] primary_text_gray"
            />
          )}
        </>
      ) : (
        <button
          type="button"
          onClick={handleOpen}
          disabled={shouldDisabledSearch}
          className={cn(
            "h-full w-10 flex items-center justify-center rounded-md primary_bg primary_border",
            {
              "cursor-not-allowed opacity-50": shouldDisabledSearch,
            }
          )}
        >
          <Search strokeWidth={1} size={20} className="primary_text_gray" />
        </button>
      )}
    </div>
  );
}
