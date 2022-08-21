import { SickcaseView } from "./SickcaseView";

export const SickcasesList = ({ sickcases, update }) => {
  return (
    <div className="row">
      {sickcases &&
        sickcases.map((sickcase) => (
          <SickcaseView key={sickcase.id} sickcase={sickcase} update={update} />
        ))}
    </div>
  );
};
