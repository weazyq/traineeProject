namespace Tools
{
    public class Result
    {
        public String[] Errors { get; }
        public Boolean IsSuccess => Errors.Length == 0;

        public static Result Success () => new Result(new String[0]);
        public static Result Filed (String error) => new Result(error);

        public Result(String error)
        {
            Errors = new String[] { error };
        }

        public Result(String[] errors)
        {
            Errors = errors;
        }
    }
}