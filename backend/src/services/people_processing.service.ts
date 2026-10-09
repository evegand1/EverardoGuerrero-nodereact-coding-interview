import people_data from '../data/people_data.json';

export class PeopleProcessing {
    getById(id: number) {
        return people_data.find((p) => p.id === id);
    }

    getAll() {
        return people_data;
    }

    getByFullName(searchTerm: string) {
        const term = searchTerm.toLowerCase();
        return people_data.find(person => {
            const fullName = (person.first_name + " " + person.last_name).toLowerCase();
            return fullName.includes(term);
        });
    }
}
