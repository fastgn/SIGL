import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { Input } from "@/components/ui/input.tsx";
import { SearchIcon } from "lucide-react";

export interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filter: { id: number; name: string }[];
  setFilter: (filterId: number) => void;
  sortOptions: { id: number; name: string }[];
  setSortOption: (sortOptionId: number) => void;
}

export const SearchBar = ({
  searchTerm,
  onSearchChange,
  filter,
  setFilter,
  sortOptions,
  setSortOption,
}: SearchBarProps) => {
  return (
    <div className="flex flex-row justify-between p-3 shadow-0 rounded-[18px] bg-blue-10">
      <div className="flex flex-row gap-5">
        <Select onValueChange={(value) => setFilter(Number(value))}>
          <SelectTrigger className="bg-white rounded-[6px] shadow-1">
            <SelectValue placeholder="Filtre" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {filter.map((filter) => (
                <SelectItem key={filter.id} value={filter.id.toString()}>
                  {filter.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select onValueChange={(value) => setSortOption(Number(value))}>
          <SelectTrigger className="bg-white rounded-[6px] shadow-1">
            <SelectValue placeholder="Tri" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {sortOptions.map((sortOption) => (
                <SelectItem key={sortOption.id} value={sortOption.id.toString()}>
                  {sortOption.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="bg-white rounded-[6px] shadow-1 w-2/5 relative ">
        <Input
          type="search"
          placeholder="Rechercher"
          className="pr-8 rounded-[6px]"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <SearchIcon className="w-4 h-4 absolute right-2.5 top-2.5 text-gray-500 dark:text-gray-400" />
      </div>
      <div className="w-28"></div>
    </div>
  );
};
