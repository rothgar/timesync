import Controller from "./Controller";
import TimezoneSearch from "./TimezoneSearch";

export default function MenuBar() {
  return (
    <div className="mb-6 h-10 flex gap-2">
      <Controller />
      <TimezoneSearch />
    </div>
  );
}
