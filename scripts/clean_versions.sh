#!/bin/bash
# Delete obsolete elasticbeanstalk app versions
# http://franklanganke.com/remove-old-aws-elastic-beanstalk-application-versions-bash-cron/
PATH=/usr/local/bin:/bin:/usr/bin:/usr/local/sbin:/usr/sbin:/sbin:/opt/aws/bin:/home/ec2-user/bin

# set defaults for name and limit
_appName=${1:-foo-app}
_limit=${2:-"45"}

echo "$(date)    checking app:$_appName with limit:$_limit "

# get app versions above the limit as a list
versions=$(aws elasticbeanstalk describe-application-versions --application-name $_appName --query ApplicationVersions[*].[VersionLabel] --output text | tail -n +$_limit)

# delete obsolete versions
for version in $versions
do
    aws elasticbeanstalk delete-application-version --delete-source-bundle\
        --version-label "$version" --application-name "$_appName"
    echo "$(date)    $_appName:$version deleted"
done