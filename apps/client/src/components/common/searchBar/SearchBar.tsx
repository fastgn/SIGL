import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, ListRestart, SearchIcon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filters?: string[];
  setSelectedFilter?: (filter: string) => void;
  sortOptions?: string[];
  setSelectedSortOption?: (sortOption: string) => void;
  clearSearch: () => void;
}

export const SearchBar = ({
  searchTerm,
  onSearchChange,
  filters,
  setSelectedFilter,
  sortOptions,
  setSelectedSortOption,
  clearSearch,
}: SearchBarProps) => {
  const { t } = useTranslation();
  const [filterChoice, setFilterChoice] = useState<string | null>("");
  const [sortOptionChoice, setSortOptionChoice] = useState<string | null>("");

  const clearSearchOption = () => {
    clearSearch();
    setFilterChoice(null);
    setSortOptionChoice(null);
  };

  const updateFilterChoice = (value: string) => {
    setFilterChoice(value);
    setSelectedFilter?.(value);
  };

  const updateSortOptionChoice = (value: string) => {
    setSortOptionChoice(value);
    setSelectedSortOption?.(value);
  };

  const hasFilters = filters && filters.length > 0 && setSelectedFilter;
  const hasSortOptions = sortOptions && sortOptions.length > 0 && setSelectedSortOption;

  return (
    <div className="flex flex-col md:flex-row justify-between p-3 shadow-0 rounded-[18px] bg-blue-10 gap-1">
      <div className="flex flex-row gap-3 items-center justify-between">
        <div className="flex-row gap-3 items-center hidden md:flex">
          {(hasFilters || hasSortOptions) && (
            <div className="flex flex-row gap-5">
              {hasFilters && (
                <Select
                  onValueChange={(value) => updateFilterChoice(value)}
                  value={filterChoice || ""}
                >
                  <SelectTrigger className="bg-white rounded-[6px] shadow-1">
                    <SelectValue placeholder="Filtre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {filters.map((filter) => (
                        <SelectItem key={filter} value={filter}>
                          {t(`globals.filters.${filter}`)}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
              {hasSortOptions && (
                <Select
                  onValueChange={(value) => updateSortOptionChoice(value)}
                  value={sortOptionChoice || ""}
                >
                  <SelectTrigger className="bg-white rounded-[6px] shadow-1">
                    <SelectValue placeholder="Tri" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {sortOptions.map((sortOption) => (
                        <SelectItem key={sortOption} value={sortOption}>
                          {t(`globals.sortOptions.${sortOption}`)}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            </div>
          )}
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="empty" className="w-fit p-2 h-fit md:hidden">
              <span className="relative">
                <Filter className="w-5 h-5 text-gray-700" />
                {(filterChoice || sortOptionChoice) && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center w-[10px] h-[10px] text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full" />
                )}
              </span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader className="items-start">
              <DialogTitle>Filtres et tri</DialogTitle>
            </DialogHeader>

            <div className="flex flex-col gap-4">
              {hasFilters && (
                <Select
                  onValueChange={(value) => updateFilterChoice(value)}
                  value={filterChoice || ""}
                >
                  <SelectTrigger className="bg-white rounded-[6px] shadow-1">
                    <SelectValue placeholder="Filtre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {filters.map((filter) => (
                        <SelectItem key={filter} value={filter}>
                          {t(`globals.filters.${filter}`)}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
              {hasSortOptions && (
                <Select
                  onValueChange={(value) => updateSortOptionChoice(value)}
                  value={sortOptionChoice || ""}
                >
                  <SelectTrigger className="bg-white rounded-[6px] shadow-1">
                    <SelectValue placeholder="Tri" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {sortOptions.map((sortOption) => (
                        <SelectItem key={sortOption} value={sortOption}>
                          {t(`globals.sortOptions.${sortOption}`)}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
              <Button variant="admin" onClick={clearSearchOption}>
                Réinitialiser
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        {(hasFilters || hasSortOptions) && (
          <div className="h-full flex flex-col justify-center">
            <Button variant="empty" className="w-fit p-2 h-fit" onClick={clearSearchOption}>
              <ListRestart className="w-5 h-5 text-gray-700" />
            </Button>
          </div>
        )}
      </div>
      <div
        className={`bg-white rounded-[6px] shadow-1 w-full ${hasFilters || hasSortOptions ? "md:w-2/5" : ""} relative`}
      >
        <Input
          type="search"
          placeholder="Rechercher"
          className="pr-8 rounded-[6px]"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <SearchIcon className="w-4 h-4 absolute right-2.5 top-2.5 text-gray-500 dark:text-gray-400" />
      </div>
    </div>
  );
};

export default SearchBar;
