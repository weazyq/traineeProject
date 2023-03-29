using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Groups;
using Npgsql;
using Tools;

namespace Services.Groups.Repository
{
    public class GroupRepository
    {
        private readonly string _connectionString;

        public GroupRepository(String connectionString)
        {
            _connectionString = connectionString;
        }

        public Group[] GetGroups(String? queryString)
        {
            List<Group> groups = new List<Group>();

            using (var connection = new NpgsqlConnection(_connectionString))
            {
                connection.Open();

                using (var command = new NpgsqlCommand())
                {
                    command.Connection = connection;
                    command.CommandText = $"SELECT * FROM \"group\" g WHERE g.isremoved = false AND  g.name ILIKE '%{queryString}%'";

                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            Group group = new Group(reader.GetGuid(1),reader.GetString(0),reader.GetBoolean(2));
                            groups.Add(group);
                        }
                    }
                }
            }
            return groups.ToArray();
        }

        public Group[] GetGroups(Guid[] id) 
        {
            List<Group> groups = new List<Group>();

            using (var connection = new NpgsqlConnection(_connectionString))
            {
                connection.Open();

                using (var command = new NpgsqlCommand())
                {
                    command.Connection = connection;
                    command.Parameters.AddWithValue("id", id);
                    command.CommandText = ("Select * from \"group\" g where id = ANY(@id)");

                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            Group group = new Group(reader.GetGuid(1), reader.GetString(0), reader.GetBoolean(2));
                            groups.Add(group);
                        }
                    }
                }
            }

            return groups.ToArray(); 
        }
        public Result RemoveGroup(Guid id)
        {
            using (var connection = new NpgsqlConnection(_connectionString))
            {
                connection.Open();

                using (var cmd = new NpgsqlCommand())
                {
                    cmd.Connection = connection;
                    cmd.Parameters.Add(new NpgsqlParameter("@id", id));
                    cmd.CommandText = "UPDATE \"group\" SET isremoved = true where id = @id";

                    cmd.ExecuteNonQuery();
                    return Result.Success();
                }
            }
        }
    }
}
