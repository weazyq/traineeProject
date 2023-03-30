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
                    command.CommandText = $"SELECT * FROM \"groups\" g WHERE g.isremoved = false AND  g.name ILIKE '%{queryString}%'";

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

        public Page<Group> GetGroups(Int32 pageNumber, Int32 countInPage, String? queryString)
        {
            List<Group> groups = new List<Group>();

            Int64 totalRows = 0;

            using (var connection = new NpgsqlConnection(_connectionString))
            {
                connection.Open();

                using (var command = new NpgsqlCommand())
                {
                    command.Connection = connection;

                    command.Parameters.AddWithValue("@countInPage", countInPage);
                    command.Parameters.AddWithValue("@offset", (pageNumber - 1) * countInPage);

                    command.CommandText = $"SELECT *, COUNT(*) OVER() AS totalrows FROM groups g WHERE isremoved = false " +
                        (String.IsNullOrEmpty(queryString) ? "" : $"AND  g.name ILIKE '%{queryString}%' ")
                        + "ORDER BY createddatetimeutc DESC OFFSET @offset LIMIT @countInPage";

                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            totalRows = reader.GetInt64(5);
                            Group group = new Group(reader.GetGuid(1), reader.GetString(0), reader.GetBoolean(2));
                            groups.Add(group);
                        }
                    }
                }
            }

            Page<Group> page = new Page<Group>(groups.ToArray(), totalRows);
            return page;
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
                    command.CommandText = ("Select * from \"groups\" g where id = ANY(@id)");

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

        public Group? GetGroup(Guid id)
        {
            Group? group = null;

            using (var connection = new NpgsqlConnection(_connectionString))
            {
                connection.Open();

                using (var cmd =  new NpgsqlCommand())
                {
                    cmd.Connection = connection;
                    cmd.Parameters.Add(new NpgsqlParameter("@id", id));
                    cmd.CommandText = "SELECT * from groups WHERE id = @id";

                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            group = new Group(reader.GetGuid(1),reader.GetString(0),reader.GetBoolean(2));
                        }
                    }
                }
            }

            return group;
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
                    cmd.CommandText = "UPDATE \"groups\" SET isremoved = true where id = @id";

                    cmd.ExecuteNonQuery();
                    return Result.Success();
                }
            }
        }

        public Result SaveGroup(GroupBlank group)
        {
            using (var connection = new NpgsqlConnection(_connectionString))
            {
                connection.Open();

                using (var cmd = new NpgsqlCommand())
                {
                    cmd.Connection = connection;

                    if (group.Id == null)
                    {
                        group.Id = Guid.NewGuid();
                    }

                    cmd.Parameters.AddWithValue("@name", NpgsqlTypes.NpgsqlDbType.Varchar, group.Name);
                    cmd.Parameters.AddWithValue("@id", NpgsqlTypes.NpgsqlDbType.Uuid, group.Id);
                    cmd.Parameters.AddWithValue("@time", NpgsqlTypes.NpgsqlDbType.Timestamp, DateTime.Now);

                    cmd.CommandText = @"INSERT INTO groups (name,id,createddatetimeutc) values (@name, @id, @time)
                                        ON CONFLICT (id) DO UPDATE SET name = @name, modifieddatetimeutc = @time";
                    cmd.ExecuteNonQuery();

                    return Result.Success();
                }
            }
        }
    }
}
